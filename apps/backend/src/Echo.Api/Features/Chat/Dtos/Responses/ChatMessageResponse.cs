using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Chat.Dtos.Responses
{
    public record ChatMessageResponse(
        Guid Id,
        Guid ConversationId,
        Guid SenderId,
        string Content,
        DateTime CreatedAt
    );
}