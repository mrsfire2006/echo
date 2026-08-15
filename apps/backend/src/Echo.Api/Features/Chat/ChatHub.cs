using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Echo.Api.Features.Chat.ChatHubServices;
using Echo.Api.Features.Chat.Dtos.Requests;
using Echo.Api.Features.Chat.Interfaces;
using Echo.Api.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Echo.Api.Features.Chat
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly ChatService _chatService;
        private readonly PresenceTracker _presenceTracker;

        public ChatHub(ChatService chatService, PresenceTracker presenceTracker)
        {
            _chatService = chatService;
            _presenceTracker = presenceTracker;
        }

        public override async Task OnConnectedAsync()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == Guid.Empty)
            {
                Context.Abort();
                return;
            }

            var userIdStr = currentUserId.ToString();

            var isFirst = await _presenceTracker.UserConnected(userIdStr, Context.ConnectionId);
            List<string> contactUserIds = await _chatService.GetContactUserIdsAsync(currentUserId);
            if (isFirst && contactUserIds.Any())
            {
                await Clients.Users(contactUserIds).UserOnline(currentUserId);
            }
            if (contactUserIds.Any())
            {
                var onlineContactIds = await _presenceTracker.GetOnlineUsersAsync(contactUserIds);

                await Clients.Caller.InitialOnlineUsers(onlineContactIds);
            }
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId != Guid.Empty)
            {
                var userIdStr = currentUserId.ToString();
                var isCompletelyOffline = await _presenceTracker.UserDisconnected(userIdStr, Context.ConnectionId);

                if (isCompletelyOffline)
                {
                    List<string> contactUserIds = await _chatService.GetContactUserIdsAsync(currentUserId);
                    if (contactUserIds.Any())
                    {
                        await Clients.Users(contactUserIds).UserOffline(currentUserId);
                    }
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
        public async Task<HttpResult> SendPrivateMessageAsync(SendMessageRequest request)
        {
            var UserId = GetCurrentUserId();

            if (UserId == Guid.Empty)
            {
                return HttpResult.Failure("Unauthorized", StatusCodes.Status401Unauthorized);
            }
            request.SenderId = UserId;

            var result = await _chatService.SaveMessageAsync(request);

            if (result.IsFailure)
            {
                return HttpResult.Failure(result.ErrorMessage, result.StatusCode);
            }
            var messageResponse = result.Value!;

            await Clients.User(request.ReceiverId.ToString()).ReceivePrivateMessage(messageResponse);
            await Clients.Caller.ReceivePrivateMessage(messageResponse);
            return HttpResult.Success();
        }

        public async Task SendTypingAsync()
        {
            var currentUserId = GetCurrentUserId();
            List<string> contactUserIds = await _chatService.GetContactUserIdsAsync(currentUserId);

            await Clients.Users(contactUserIds)
                        .UserTyping(currentUserId);
        }

        public async Task SendStoppedTypingAsync()
        {
            var currentUserId = GetCurrentUserId();
            List<string> contactUserIds = await _chatService.GetContactUserIdsAsync(currentUserId);

            await Clients.Users(contactUserIds)
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