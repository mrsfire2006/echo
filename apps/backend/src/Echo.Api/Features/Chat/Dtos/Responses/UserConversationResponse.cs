using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Chat.Dtos.Responses
{


    public record UserConversationResponse(
        Guid ConversationId,
        Guid UserId,
        string Username,
        string lastMessage,
        int unReadMessage,
        DateTime? lastMessageTime
    );
}