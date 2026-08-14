using System;
using Echo.Api.Shared.Common.Base;

namespace Echo.Api.Features.Chat.Domain.Entities
{
    public class Message : Entity
    {
        public Guid ConversationId { get; private set; }

        public Guid SenderId { get; private set; }

        public string Content { get; private set; } = default!;

        public DateTime CreatedAt { get; private set; }



        private Message()
            : base(Guid.Empty)
        {
        }

        private Message(
            Guid id,
            Guid conversationId,
            Guid senderId,
            string content)
            : base(id)
        {
            ConversationId = conversationId;
            SenderId = senderId;
            Content = content;
            CreatedAt = DateTime.UtcNow;
        }

        public static Message Create(
            Guid conversationId,
            Guid senderId,
            string content)
        {

            return new Message(
                Guid.NewGuid(),
                conversationId,
                senderId,
                content);
        }


    }
}