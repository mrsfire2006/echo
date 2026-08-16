using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Chat.Dtos.Requests;
using Echo.Api.Features.Chat.Dtos.Responses;

namespace Echo.Api.Features.Chat.Interfaces
{
    public interface IChatClient
    {
        Task ReceivePrivateMessage(ChatMessageResponse response);


        Task UserTyping(Guid userId);
        Task UserStoppedTyping(Guid userId);
        Task UserOnline(Guid userId);
        Task UserOffline(Guid userId);
        Task InitialOnlineUsers(List<string>? users);
        Task ConversationCreated();
    }
}