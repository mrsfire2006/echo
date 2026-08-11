using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Echo.Api.Features.Chat.Dtos.Requests
{
    public record GetOrCreateConversationRequest
    {

        [JsonIgnore]
        [BindNever]
        public Guid SenderId { get;set; }
        public Guid ReceiverId { get; }
        public GetOrCreateConversationRequest(Guid senderId, Guid receiverId)
        {
            SenderId = senderId;
            ReceiverId = receiverId;
        }
        
    };
}