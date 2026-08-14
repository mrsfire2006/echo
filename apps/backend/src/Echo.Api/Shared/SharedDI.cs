using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Echo.Api.Features;
using Echo.Api.Features.Auth.Common;
using Echo.Api.Features.Chat.ChatHubServices;
using Echo.Api.Features.Shared.Infrastructure.Persistence;
using Echo.Api.Shared.Pipelines;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Echo.Api.Shared
{
    public static class SharedDI
    {
        public static IServiceCollection AddSharedFeature(
    this IServiceCollection services,
    IConfiguration configuration)
        {
            AddDatabase(services, configuration);

            AddAuthentication(services, configuration);
            AddAuthorization(services);

            AddSingalR(services);
            services.AddSingleton<PresenceTracker>();

            services.AddTransient(typeof(ValidationBehavior<,>));
            services.AddValidatorsFromAssemblyContaining<FeaturesMarker>();
            return services;
        }
        private static void AddDatabase(
        IServiceCollection services,
        IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(
                    configuration.GetConnectionString("EchoDb"));
            });
        }

        private static void AddAuthentication(
           IServiceCollection services,
           IConfiguration configuration)
        {
            services.Configure<JwtOptions>(
                configuration.GetSection(
                    JwtOptions.SectionName));


            var jwtOptions =
                configuration
                    .GetSection(JwtOptions.SectionName)
                    .Get<JwtOptions>()!;


            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
       .AddJwtBearer(options =>
       {
           options.TokenValidationParameters =
               new TokenValidationParameters
               {
                   ValidateIssuer = true,
                   ValidIssuer = jwtOptions.Issuer,

                   ValidateAudience = true,
                   ValidAudience = jwtOptions.Audience,

                   ValidateLifetime = true,

                   ValidateIssuerSigningKey = true,

                   IssuerSigningKey =
                       new SymmetricSecurityKey(
                           Encoding.UTF8.GetBytes(jwtOptions.Key)),
                   NameClaimType = ClaimTypes.NameIdentifier,
                   ClockSkew = TimeSpan.Zero
               };
           options.Events = new JwtBearerEvents
           {
               OnMessageReceived = context =>
               {
                   if (context.Request.Cookies.TryGetValue("access_token", out var cookieToken)
                       && !string.IsNullOrEmpty(cookieToken))
                   {
                       context.Token = cookieToken;
                       return Task.CompletedTask;
                   }

                   var accessToken = context.Request.Query["access_token"];
                   var path = context.HttpContext.Request.Path;

                   if (!string.IsNullOrEmpty(accessToken) &&
                       path.StartsWithSegments("/chat"))
                   {
                       context.Token = accessToken!;
                   }

                   return Task.CompletedTask;
               }
           };
       });
        }
        private static void AddAuthorization(
   IServiceCollection services)
        {
            services.AddAuthorization();
        }
        private static void AddSingalR(IServiceCollection services)
        {

            services.AddSignalR();

        }


    }
}