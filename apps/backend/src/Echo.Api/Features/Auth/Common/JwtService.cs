using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Echo.Api.Features.Users.Domain;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using Echo.Api.Features.Auth.Common;


namespace Echo.Api.Features.Users.Infrastructure.Services
{
    public class JwtService  
    {
        private readonly JwtOptions _options;


        public JwtService(
            IOptions<JwtOptions> options)
        {
            _options = options.Value;
        }


        public string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _options.Key!));


            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);


            var claims = new List<Claim>
        {
            new(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()),

            new(
                ClaimTypes.Email,
                user.Email),

            new(
                ClaimTypes.Name,
                user.Username)
        };


            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),

                Expires = DateTime.UtcNow
                    .AddMinutes(15),

                SigningCredentials = credentials,

                Issuer = _options.Issuer,

                Audience = _options.Audience
            };


            var handler = new JwtSecurityTokenHandler();


            var token = handler.CreateToken(descriptor);


            return handler.WriteToken(token);
        }


    }
}