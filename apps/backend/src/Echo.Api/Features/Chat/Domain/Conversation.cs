using System;
using System.Collections.Generic;
using System.Linq;
using Echo.Api.Features.Chat.Domain.Enums;
using Echo.Api.Shared.Common.Base;

namespace Echo.Api.Features.Chat.Domain.Entities
{
    public class Conversation : AggregateRoot
    {
        private readonly List<ConversationMember> _members = new();
        public IReadOnlyCollection<ConversationMember> Members => _members.AsReadOnly();

        private readonly List<Message> _messages = new();
        public IReadOnlyCollection<Message> Messages => _messages.AsReadOnly();

        public DateTime CreatedAt { get; private set; }

        public Guid? LastMessageId { get; private set; }
        public string? LastMessagePreview { get; private set; }
        public DateTime? LastMessageAt { get; private set; }
        public Guid? LastMessageSenderId { get; private set; }

        private Conversation() : base(Guid.Empty)
        {
        }

        private Conversation(Guid id) : base(id)
        {
            CreatedAt = DateTime.UtcNow;
        }

        public static Conversation Create()
        {
            return new Conversation(Guid.NewGuid());
        }

        public void AddMember(Guid userId)
        {

            var member = ConversationMember.Create(userId, Id);
            _members.Add(member);
        }
        public IReadOnlyCollection<Guid> MarkMessagesByStatus(Guid[] messageIds, ChatMessageStatus status)
        {
            var ids = messageIds.ToHashSet();
            var MessageIds = new List<Guid>();
            foreach (var message in _messages)
            {
                if (!ids.Contains(message.Id))
                    continue;

                var messageId = message.MarkByStatus(status);

                if (messageId.HasValue)
                {
                    MessageIds.Add(messageId.Value);
                }
            }

            return MessageIds;
        }

      
        public Message AddMessage(Guid senderId, string content, ChatMessageStatus status)
        {
            var isMember = _members.Any(m => m.UserId == senderId);




            var message = Message.Create(Id, senderId, content, status);
            _messages.Add(message);

            LastMessagePreview = content.Length > 100 ? content[..100] : content;
            LastMessageAt = message.CreatedAt;
            LastMessageSenderId = senderId;
            LastMessageId = message.Id;

            return message;
        }
    }
}