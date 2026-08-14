using System;
using Echo.Api.Shared.Base;
using Echo.Api.Shared.Common.Base;

namespace Echo.Api.Features.Chat.Domain.Entities
{
    public class ConversationMember : Entity
    {
        public Guid UserId { get; private set; }
        public Guid ConversationId { get; private set; }
        public DateTime JoinedAt { get; private set; }
        public Guid? LastReadMessageId { get; private set; }
        public DateTime? LastReadAt { get; private set; }

        // EF Core Constructor
        private ConversationMember() : base(Guid.Empty)
        {
        }

        private ConversationMember(
            Guid id,
            Guid userId,
            Guid conversationId) : base(id)
        {
            UserId = userId;
            ConversationId = conversationId;
            JoinedAt = DateTime.UtcNow;
        }

        public static ConversationMember Create(Guid userId, Guid conversationId)
        {

            return new ConversationMember(Guid.NewGuid(), userId, conversationId);
        }

        public void MarkAsRead(Guid messageId)
        {
            

            LastReadMessageId = messageId;
            LastReadAt = DateTime.UtcNow;
        }
    }
}