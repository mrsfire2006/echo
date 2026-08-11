using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Chat.Dtos.Requests;
using Echo.Api.Features.Chat.Dtos.Responses;
using Echo.Api.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Echo.Api.Features.Chat
{
    [Route("chat")]
    public class ChatController : ApiControllerBase
    {

        private readonly ChatService _chatService;

        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
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

    }
}