using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Auth.Common;
using Echo.Api.Features.Users.Infrastructure.Services;

namespace Echo.Api.Features.Auth
{
    public static class AuthDI
    {
        public static IServiceCollection AddAuthServices(this IServiceCollection services)
        {
            services.AddScoped<AuthService>();
            services.AddScoped<PasswordHasher>();
            services.AddScoped<RandomTokenService>();
            services.AddScoped<JwtService>();

            return services;
        }
    }
}