using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Chat.Dtos.Responses
{
    public record ConversationDetailsResponse(
            Guid UserId,
            string Name
          );
}