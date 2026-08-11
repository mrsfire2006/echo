using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Echo.Api.Features.Chat.Dtos.Requests
{
    public record GetConversationMessagesRequest(
        Guid ConversationId,
        Guid? BeforeMessageId = null,
        int? PageSize = 20
    )
    {
        [JsonIgnore]
        [BindNever]
        public Guid UserId { get; set; }
    };
}