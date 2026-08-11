using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Chat.Dtos.Responses
{


    public record UserConversationResponse(
        Guid ConversationId,
        string Username,
        string lastMessage,
        int unReadMessage,
        DateTime? lastMessageTime
    );
}