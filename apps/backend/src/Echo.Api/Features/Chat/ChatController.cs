using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Chat.ChatHubServices;
using Echo.Api.Features.Chat.Dtos.Requests;
using Echo.Api.Features.Chat.Dtos.Responses;
using Echo.Api.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Echo.Api.Features.Chat
{
    [Route("chat")]
    public class ChatController : ApiControllerBase
    {

        private readonly ChatService _chatService;
        private readonly IHubContext<ChatHub> _chat;
        private readonly PresenceTracker _presence;

        public ChatController(ChatService chatService, IHubContext<ChatHub> chat, PresenceTracker presence)
        {
            _chatService = chatService;
            _chat = chat;
            _presence = presence;
        }


        [HttpPost("conversations/direct")]
        [ProducesResponseType(typeof(HttpResult<Guid>), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateDirectConversation(
            [FromBody] GetOrCreateConversationRequest request,
            CancellationToken cancellationToken)
        {
            if (EnsureAuthenticatedUser(out Guid userId) is IActionResult)
            {
                return HandleResult(HttpResult<Guid>.Failure("Unauthorized", StatusCodes.Status401Unauthorized));
            }
            request.SenderId = userId;
            var result = await _chatService.CreateDirectConversationAsync(request, cancellationToken);

            if (result.IsSuccess)
            {
                var isUserOnline = _presence.IsUserOnline(request.ReceiverId.ToString());
                if (isUserOnline)
                {
                    await _chat.Clients.User(request.ReceiverId.ToString()).SendAsync("UserOnline", userId.ToString());
                    await _chat.Clients.User(userId.ToString()).SendAsync("UserOnline", request.ReceiverId.ToString());
                    await _chat.Clients.User(request.ReceiverId.ToString()).SendAsync("ConversationCreated", HttpResult.Success());
                }
            }
            return HandleResult(result);
        }
        [HttpGet("conversations/direct/:{receiverId:guid}")]
        [ProducesResponseType(typeof(HttpResult<Guid>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDirectConversation(
            [FromRoute] Guid receiverId,
            CancellationToken cancellationToken)
        {
            if (EnsureAuthenticatedUser(out Guid userId) is IActionResult)
            {
                return HandleResult(HttpResult<Guid>.Failure("Unauthorized", StatusCodes.Status401Unauthorized));
            }

            var command = new GetOrCreateConversationRequest(userId, receiverId);

            var result = await _chatService.GetDirectConversationAsync(command, cancellationToken);
            return HandleResult(result);
        }



        [HttpGet("conversations/direct/messages")]
        [ProducesResponseType(typeof(HttpResult<IEnumerable<ChatMessageResponse>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDirectConversation(
            [FromQuery] GetConversationMessagesRequest request,
            CancellationToken cancellationToken)
        {
            if (EnsureAuthenticatedUser(out Guid userId) is IActionResult)
            {
                return HandleResult(HttpResult<IEnumerable<ChatMessageResponse>>.Failure("Unauthorized", StatusCodes.Status401Unauthorized));
            }

            request.UserId = userId;

            var result = await _chatService.GetConversationMessages(request, cancellationToken);
            return HandleResult(result);
        }


        [HttpGet("conversations")]
        [Authorize]
        [ProducesResponseType(typeof(HttpResult<IEnumerable<UserConversationResponse>>), StatusCodes.Status200OK)]

        public async Task<IActionResult> GetUserConversations(CancellationToken cancellationToken)
        {
            if (EnsureAuthenticatedUser(out Guid userId) is IActionResult)
            {
                return HandleResult(HttpResult<IEnumerable<UserConversationResponse>>.Failure("Unauthorized", StatusCodes.Status401Unauthorized));
            }
            var query = new GetUserConversationsRequest(userId);

            var result = await _chatService.GetUserConversationsAsync(query, cancellationToken);
            return HandleResult(result);
        }


        [HttpGet("conversations/direct/details/:{conversationId:guid}")]
        [Authorize]
        [ProducesResponseType(typeof(HttpResult<ConversationDetailsResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetConversationDeatils(
    [FromRoute] Guid conversationId,
    CancellationToken cancellationToken)
        {
            if (EnsureAuthenticatedUser(out Guid userId) is IActionResult)
            {
                return HandleResult(HttpResult<ConversationDetailsResponse>.Failure("Unauthorized", StatusCodes.Status401Unauthorized));
            }


            var result = await _chatService.GetConversationDetails(conversationId, userId, cancellationToken);
            return HandleResult(result);
        }
        [HttpPost("conversations/direct/read/:{conversationId:guid}")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead([FromRoute] Guid conversationId, CancellationToken cancellationToken)
        {
            if (EnsureAuthenticatedUser(out Guid userId) is IActionResult)
            {
                return HandleResult(HttpResult.Failure("Unauthorized", StatusCodes.Status401Unauthorized));
            }
            var result = await _chatService.MarkAsRead(conversationId, userId);
            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(
                [FromBody] SendMessageRequest request,
                CancellationToken cancellationToken)
        {
            if (EnsureAuthenticatedUser(out Guid userId) is IActionResult)
            {
                return HandleResult(HttpResult<ChatMessageResponse>.Failure("Unauthorized", StatusCodes.Status401Unauthorized));
            }


            request.SenderId = userId;

            var result = await _chatService.SaveMessageAsync(request);

            return HandleResult(result);
        }
    }
}