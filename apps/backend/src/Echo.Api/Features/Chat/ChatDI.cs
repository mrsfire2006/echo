using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Chat
{
    public static class ChatDI
    {
        public static IServiceCollection AddChatServices(this IServiceCollection services)
        {
            services.AddScoped<ChatService>();


            return services;
        }
    }
}