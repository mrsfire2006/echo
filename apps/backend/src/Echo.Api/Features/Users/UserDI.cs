using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Users
{
    public static class UserDI
    {
        
        public static IServiceCollection AddUserServices(this IServiceCollection services)
        {
            services.AddScoped<UserService>();
            return services;
        }
    }
}