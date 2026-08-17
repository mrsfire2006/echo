using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Chat.Domain.Enums;

namespace Echo.Api.Features.Chat.Dtos.Responses
{
    public sealed record MessageStatusChanged(
        IReadOnlyCollection<Guid> MessageIds,
        string Status,
        Guid? ConversationId
    );
}