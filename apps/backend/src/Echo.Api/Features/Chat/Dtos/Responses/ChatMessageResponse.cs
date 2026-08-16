using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Chat.Dtos.Responses
{

    public record ChatMessageResponse(
        Guid Id,
        Guid SenderId,
        Guid ConversationId,
        string Content,
        // bool IsRead,
        DateTime CreatedAt
    );
}