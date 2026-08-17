using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Echo.Api.Features.Chat.Domain.Enums;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Echo.Api.Features.Chat.Dtos.Requests
{
    public record SendMessageRequest(Guid ConversationId, Guid ReceiverId, string Content)
    {
        [JsonIgnore]
        [BindNever]
        public Guid SenderId { get; set; }


        [JsonIgnore]
        [BindNever]
        public ChatMessageStatus Status { get; set; }
    };
}