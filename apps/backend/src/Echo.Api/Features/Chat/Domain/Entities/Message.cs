using System;
using Echo.Api.Features.Chat.Domain.Enums;
using Echo.Api.Features.Chat.Dtos.Responses;
using Echo.Api.Shared.Common.Base;

namespace Echo.Api.Features.Chat.Domain.Entities
{
    public class Message : Entity
    {
        public Guid ConversationId { get; private set; }

        public Guid SenderId { get; private set; }

        public string Content { get; private set; } = default!;

        public DateTime CreatedAt { get; private set; }

        public ChatMessageStatus Status { get; private set; }

        private Message()
            : base(Guid.Empty)
        {
        }

        private Message(
            Guid id,
            Guid conversationId,
            Guid senderId,
             string content,
             ChatMessageStatus status)
            : base(id)
        {
            ConversationId = conversationId;
            SenderId = senderId;
            Content = content;
            CreatedAt = DateTime.UtcNow;
            Status = status;
        }

        public static Message Create(
            Guid conversationId,
            Guid senderId,
            string content,
            ChatMessageStatus status)
        {

            return new Message(
                Guid.NewGuid(),
                conversationId,
                senderId,
                content,
                status);
        }
        public Guid? MarkByStatus(ChatMessageStatus status)
        {
            if (Status == ChatMessageStatus.Deleted)
                return null;

            if (Status == ChatMessageStatus.Read)
                return null;

            if (status == ChatMessageStatus.Delivered)
            {
                if (Status == ChatMessageStatus.Delivered)
                    return null;

                Status = ChatMessageStatus.Delivered;
                return Id;
            }

            if (status == ChatMessageStatus.Read)
            {
                Status = ChatMessageStatus.Read;
                return Id;
            }

            return null;
        }

    }
}