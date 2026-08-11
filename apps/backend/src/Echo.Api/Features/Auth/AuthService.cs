
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
            var user = await _context.Users
                            .FirstOrDefaultAsync(x =>
                                      x.Email == command.Email,
                                cancellationToken);

            if (user is null)
            {
                return HttpResult.Failure(
                    "Invalid username or password.",
                    StatusCodes.Status400BadRequest);
            }

            var validPassword = _passwordHasher.Verify(
                command.Password,
                user.PasswordHash);

            if (!validPassword)
            {
                return HttpResult.Failure(
                    "Invalid username or password.",
                    StatusCodes.Status400BadRequest);
            }
            var randomToken = _tokenService.Create();
            var token = RefreshToken.Create(user.Id, randomToken, 7);

            _context.RefreshTokens.Add(token);

            var accessToken = _jwtService.GenerateToken(user);

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
            if (string.IsNullOrEmpty(command.RefreshToken))
            {
                return HttpResult.Failure(
                    "Refresh token is required.",
                    StatusCodes.Status401Unauthorized);
            }

            var UserToken = await (from t in _context.RefreshTokens
                                   join user in _context.Users.AsNoTracking()
                                   on t.UserId equals user.Id
                                   where t.Token == command.RefreshToken
                                   select new
                                   {
                                       user,
                                       t
                                   }).FirstOrDefaultAsync();



            if (UserToken is null)
            {
                return HttpResult.Failure(
                    "Invalid refresh token.",
                    StatusCodes.Status401Unauthorized);
            }

            if (UserToken.t.IsExpired() || UserToken.t.IsRevoked)
            {
                return HttpResult.Failure(
                    "Refresh token expired or revoked.",
                    StatusCodes.Status401Unauthorized);
            }

            UserToken.t.Revoke();


            var token = _tokenService.Create();
            var refreshToken = RefreshToken.Create(UserToken.user.Id, token, 7);

            _context.RefreshTokens.Add(refreshToken);

            await _context.SaveChangesAsync(cancellationToken);


            var accessToken = _jwtService.GenerateToken(UserToken.user);

            AuthCookies.SetAuthCookies(accessToken, token, _httpContextAccessor);

            return HttpResult.Success();
        }

    }
}