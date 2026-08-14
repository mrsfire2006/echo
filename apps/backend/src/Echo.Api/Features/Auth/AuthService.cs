
using Echo.Api.Features.Auth.Common;
using Echo.Api.Features.Auth.Domain;
using Echo.Api.Features.Auth.Dtos.Requests;
using Echo.Api.Features.Shared.Infrastructure.Persistence;
using Echo.Api.Features.Users.Domain;
using Echo.Api.Features.Users.Infrastructure.Services;
using Echo.Api.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace Echo.Api.Features.Auth
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher _passwordHasher;
        private readonly RandomTokenService _tokenService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JwtService _jwtService;

        public AuthService(
           AppDbContext context,
           PasswordHasher passwordHasher,
           RandomTokenService tokenService,
           IHttpContextAccessor httpContextAccessor,
           JwtService jwtService

             )
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
            _httpContextAccessor = httpContextAccessor;
            _jwtService = jwtService;
        }
        public async Task<HttpResult> Login(LoginUserRequest command, CancellationToken cancellationToken)
        {

            var userTokens = await (from user in _context.Users.AsNoTracking()
                                    where user.Email == command.Email
                                    join t in _context.RefreshTokens on user.Id equals t.UserId into tokensGroup
                                    select new
                                    {
                                        User = user,
                                        Tokens = tokensGroup
                                    }).FirstOrDefaultAsync(cancellationToken);


            if (userTokens is null)
            {
                return HttpResult.Failure(
                    "Invalid username or password.",
                    StatusCodes.Status400BadRequest);
            }

            var validPassword = _passwordHasher.Verify(
                command.Password,
                userTokens.User.PasswordHash);

            if (!validPassword)
            {
                return HttpResult.Failure(
                    "Invalid username or password.",
                    StatusCodes.Status400BadRequest);
            }

            CleanupOldTokens(userTokens.Tokens);

            var randomToken = _tokenService.Create();
            var token = RefreshToken.Create(userTokens.User.Id, randomToken, 7);

            _context.RefreshTokens.Add(token);

            var accessToken = _jwtService.GenerateToken(userTokens.User);

            await _context.SaveChangesAsync(cancellationToken);


            AuthCookies.SetAuthCookies(accessToken, randomToken, _httpContextAccessor);

            return HttpResult.Success();
        }
        public async Task<HttpResult> Register(RegisterUserRequest command, CancellationToken cancellationToken)
        {
            var exists = await _context.Users
                            .AnyAsync(
                                x => x.Email == command.Email ||
                                     x.Username == command.Username,
                                cancellationToken);

            if (exists)
            {
                return HttpResult.Failure(
                    "Email or Username already exists.",
                    StatusCodes.Status409Conflict);
            }

            var passwordHash =
                _passwordHasher.Hash(command.Password);

            var user = User.Create(
                command.Username,
                command.Email,
                passwordHash);
            _context.Users.Add(user);

            var randomToken = _tokenService.Create();
            var token = RefreshToken.Create(user.Id, randomToken, 7);
            _context.RefreshTokens.Add(token);


            var accessToken = _jwtService.GenerateToken(user);


            await _context.SaveChangesAsync(cancellationToken);

            AuthCookies.SetAuthCookies(accessToken, randomToken, _httpContextAccessor);

            return HttpResult.Success();
        }
        public async Task<HttpResult> Refresh(RefreshTokenRequest command, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(command.RefreshToken))
            {
                return HttpResult.Failure(
                    "Refresh token is required.",
                    StatusCodes.Status400BadRequest);
            }

            var userTokens = await (from targetToken in _context.RefreshTokens.AsNoTracking()
                                    where targetToken.Token == command.RefreshToken
                                    join user in _context.Users.AsNoTracking() on targetToken.UserId equals user.Id
                                    
                                    join t in _context.RefreshTokens on user.Id equals t.UserId into tokensGroup
                                    select new
                                    {
                                        User = user,
                                        Tokens = tokensGroup
                                    }).FirstOrDefaultAsync(cancellationToken);


            if (userTokens == null || userTokens.Tokens.ToList().Count == 0)
            {
                return HttpResult.Failure(
                    "Invalid refresh token.",
                    StatusCodes.Status400BadRequest);
            }

            var currentUser = userTokens.User;
            var currentTokens = userTokens.Tokens;
            var currentToken = currentTokens.FirstOrDefault(x => x.Token == command.RefreshToken);

            if (currentToken is null || currentToken.IsExpired())
            {
                return HttpResult.Failure(
                    "Refresh token expired or revoked.",
                    StatusCodes.Status400BadRequest);
            }



            CleanupOldTokens(userTokens.Tokens);


            var newTokenString = _tokenService.Create();
            var newRefreshToken = RefreshToken.Create(currentUser.Id, newTokenString, 7);

            _context.RefreshTokens.Add(newRefreshToken);

            await _context.SaveChangesAsync(cancellationToken);

            var accessToken = _jwtService.GenerateToken(currentUser);
            AuthCookies.SetAuthCookies(accessToken, newTokenString, _httpContextAccessor);

            return HttpResult.Success();
        }
        private void CleanupOldTokens(IEnumerable<RefreshToken> existingTokens, int maxAllowedTokens = 5)
        {
            var tokensList = existingTokens.ToList();

            if (tokensList.Count >= maxAllowedTokens)
            {
                var countToRemove = tokensList.Count - maxAllowedTokens + 1;
                var tokensToRemove = tokensList
                    .OrderBy(x => x.CreatedAt)
                    .Take(countToRemove);

                _context.RefreshTokens.RemoveRange(tokensToRemove);
            }
        }

        public async Task<HttpResult> LogOut(string? refreshToken, CancellationToken cancellationToken = default)
        {
            if (!string.IsNullOrWhiteSpace(refreshToken))
            {
                var tokenEntity = await _context.RefreshTokens
                    .FirstOrDefaultAsync(x => x.Token == refreshToken, cancellationToken);

                if (tokenEntity is not null)
                {
                    _context.RefreshTokens.Remove(tokenEntity);
                    await _context.SaveChangesAsync(cancellationToken);
                }
            }

            AuthCookies.RemoveAuthCookies(_httpContextAccessor);

            return HttpResult.Success();
        }
    }
}