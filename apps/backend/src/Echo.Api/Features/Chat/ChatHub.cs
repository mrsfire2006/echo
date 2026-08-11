using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Echo.Api.Features.Chat.Dtos.Requests;
using Echo.Api.Features.Chat.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Echo.Api.Features.Chat
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly ChatService _chatService;
        public ChatHub(ChatService chatService)
        {
            _chatService = chatService;
        }

        public override async Task OnConnectedAsync()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId != Guid.Empty)
            {
                List<string> contactUserIds = await _chatService.GetContactUserIdsAsync(currentUserId);

                if (contactUserIds.Count > 0)
                {
                    await Clients.Users(contactUserIds).UserOnline(currentUserId);
                }
            }

            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId != Guid.Empty)
            {
                List<string> contactUserIds = await _chatService.GetContactUserIdsAsync(currentUserId);

                if (contactUserIds.Count > 0)
                {
                    await Clients.Users(contactUserIds).UserOffline(currentUserId);
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
        public async Task SendPrivateMessageAsync(SendMessageRequest request)
        {
            if (!Guid.TryParse(Context.UserIdentifier!, out Guid UserId))
            {
                return;
            }
            request.SenderId = UserId;

            var result = await _chatService.SaveMessageAsync(request);

            if (result.IsFailure)
            {
                return;
            }
            var messageResponse = result.Value!;

            await Clients.User(request.ReceiverId.ToString()).ReceivePrivateMessage(messageResponse);
            await Clients.User(messageResponse.SenderId.ToString()).ReceivePrivateMessage(messageResponse);
        }

        public async Task SendTypingAsync(Guid receiverId)
        {
            var currentUserId = GetCurrentUserId();

            await Clients.User(receiverId.ToString())
                        .UserTyping(currentUserId);
        }

        public async Task SendStoppedTypingAsync(Guid receiverId)
        {
            var currentUserId = GetCurrentUserId();

            await Clients.User(receiverId.ToString())
                         .UserStoppedTyping(currentUserId);
        }
        private Guid GetCurrentUserId()
        {
            var userIdStr = Context.UserIdentifier
                         ?? Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return Guid.TryParse(userIdStr, out var userId) ? userId : Guid.Empty;
        }

    }
}