using System;
using System.Collections.Generic;
using System.Linq;
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

        public void MarkMessageAsRead(Guid userId, Guid messageId)
        {
            var member = _members.FirstOrDefault(m => m.UserId == userId);
  
            member!.MarkAsRead(messageId);
        }

        public Message AddMessage(Guid senderId, string content)
        {
            var isMember = _members.Any(m => m.UserId == senderId);
            if (!isMember)
                throw new InvalidOperationException("Sender must be a member of the conversation.");

            var message = Message.Create(Id, senderId, content);
            _messages.Add(message);

            LastMessagePreview = content.Length > 100 ? content[..100] : content;
            LastMessageAt = message.CreatedAt;
            LastMessageSenderId = senderId;

            return message;
        }
    }
}