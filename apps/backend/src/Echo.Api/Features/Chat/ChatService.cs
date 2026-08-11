using Echo.Api.Features.Chat.Domain.Entities;
using Echo.Api.Features.Chat.Dtos.Requests;
using Echo.Api.Features.Chat.Dtos.Responses;
using Echo.Api.Features.Shared.Infrastructure.Persistence;
using Echo.Api.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace Echo.Api.Features.Chat
{
    public class ChatService
    {
        private readonly AppDbContext _context;
        public ChatService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<HttpResult<Guid>> CreateDirectConversationAsync(
            GetOrCreateConversationRequest command,
            CancellationToken cancellationToken)
        {
            var senderId = command.SenderId;
            var receiverId = command.ReceiverId;
            if (senderId == receiverId)
            {
                return HttpResult<Guid>.Failure("You cannot create a conversation with yourself.");
            }

            var exists = await _context.Conversations.AsNoTracking()
               .AnyAsync(c =>
                   c.Members.Any(m => m.UserId == senderId) &&
                   c.Members.Any(m => m.UserId == receiverId),
                   cancellationToken);

            if (exists)
            {
                return HttpResult<Guid>.Failure("Conversation already exists.");
            }

            var conversation = Conversation.Create();
            conversation.AddMember(senderId);
            conversation.AddMember(receiverId);

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync(cancellationToken);

            return HttpResult<Guid>.Success(conversation.Id);
        }


        public async Task<HttpResult<Guid>> GetDirectConversationAsync(GetOrCreateConversationRequest query, CancellationToken cancellationToken)
        {
            var senderId = query.SenderId;
            var receiverId = query.ReceiverId;
            if (senderId == receiverId)
            {
                return HttpResult<Guid>.Failure("No Conversation");
            }

            var exists = await _context.Conversations.AsNoTracking()
                .FirstOrDefaultAsync(c =>
                   c.Members.Any(m => m.UserId == senderId) &&
                   c.Members.Any(m => m.UserId == receiverId));

            if (exists == null)
            {
                return HttpResult<Guid>.Failure("Conversation Not Exist.");
            }
            return HttpResult<Guid>.Success(exists.Id);
        }


        public async Task<HttpResult<IEnumerable<UserConversationResponse>>> GetUserConversationsAsync(GetUserConversationsRequest query, CancellationToken cancellationToken)
        {
            var conversations = await (
                from c in _context.Conversations
                where c.Members.Any(m => m.UserId == query.UserId)

                let otherUserId = c.Members
                   .Where(m => m.UserId != query.UserId)
                   .Select(m => m.UserId)
                   .FirstOrDefault()

                join u in _context.Users on otherUserId equals u.Id

                orderby c.LastMessageAt descending

                select new UserConversationResponse(
                    c.Id,
                    u.Username,
                    c.LastMessagePreview ?? string.Empty,

                    c.Messages.Count(m => m.SenderId != query.UserId
                                  && m.ReadAt == null),

                    c.LastMessageAt ?? null
                )
            ).ToListAsync(cancellationToken);


            return HttpResult<IEnumerable<UserConversationResponse>>.Success(conversations);
        }

        public async Task<HttpResult<ChatMessageResponse>> SaveMessageAsync(SendMessageRequest request)
        {
            if (request.SenderId == request.ReceiverId)
            {
                return HttpResult<ChatMessageResponse>.Failure(
                    "You cannot send a message to yourself.");
            }
            var conversation = await _context.Conversations
                    .Include(c => c.Members)
                    .FirstOrDefaultAsync(c => c.Id == request.ConversationId && c.Members.Any(m => m.UserId == request.SenderId) && c.Members.Any(m => m.UserId == request.ReceiverId));

            if (conversation == null)
            {
                return HttpResult<ChatMessageResponse>.Failure("Conversation Not Exist");
            }

            var messageEntity = conversation.AddMessage(request.SenderId, request.Content);

            await _context.SaveChangesAsync();

            var response = new ChatMessageResponse(
               messageEntity.Id,
               conversation.Id,
               request.SenderId,
                messageEntity.Content,
               messageEntity.CreatedAt
            );

            return HttpResult<ChatMessageResponse>.Success(response);
        }


        public async Task<HttpResult<IEnumerable<ChatMessageResponse>>> GetConversationMessages(GetConversationMessagesRequest query, CancellationToken cancellationToken)
        {
            if (query.ConversationId == Guid.Empty)
            {
                return HttpResult<IEnumerable<ChatMessageResponse>>.Failure("Conversation id is required.");
            }
            var isMember = await _context.Conversations.AnyAsync(x => x.Id == query.ConversationId && x.Members.Any(x => x.UserId == query.UserId));

            if (!isMember)
            {
                return HttpResult<IEnumerable<ChatMessageResponse>>.Failure("Forbidden.", StatusCodes.Status403Forbidden);

            }
            var messagesQuery = _context.Conversations
                    .AsNoTracking()
                    .Where(c => c.Id == query.ConversationId)
                    .SelectMany(c => c.Messages);

            if (query.BeforeMessageId.HasValue)
            {
                messagesQuery = messagesQuery.Where(m => m.CreatedAt < _context.Conversations
                    .Where(c => c.Id == query.ConversationId)
                    .SelectMany(c => c.Messages)
                    .Where(x => x.Id == query.BeforeMessageId.Value)
                    .Select(x => x.CreatedAt)
                    .FirstOrDefault());
            }
            var pageSize = query.PageSize ?? 20;
            var messages = await messagesQuery
               .OrderByDescending(m => m.CreatedAt)
               .Take(pageSize)
               .Select(m => new ChatMessageResponse
               (
                    m.Id,
                    query.ConversationId,
                m.SenderId,
                   m.Content,
                    m.CreatedAt
               ))
               .ToListAsync();

            messages.Reverse();

            return HttpResult<IEnumerable<ChatMessageResponse>>.Success(messages);

        }


        public async Task<List<string>> GetContactUserIdsAsync(Guid userId)
        {
            return await _context.Conversations
                .AsNoTracking()
                .Where(c => c.Members.Any(m => m.UserId == userId))
                .SelectMany(c => c.Members)
                 .Where(m => m.UserId != userId)
                .Select(m => m.UserId.ToString())
                .Distinct()
                .ToListAsync();
        }

        public async Task<HttpResult<ConversationDetailsResponse>> GetConversationDetails(Guid ConversationId, Guid UserId, CancellationToken cancellationToken)
        {
            var response = await (from c in _context.Conversations.AsNoTracking()
                                  where c.Id == ConversationId
                                  let otherUserId = c.Members
                                      .Where(m => m.UserId != UserId)
                                      .Select(m => m.UserId)
                                      .FirstOrDefault()
                                  join u in _context.Users on otherUserId equals u.Id
                                  select new ConversationDetailsResponse(
                                          u.Id,
                                          u.Username

                                  ))
                                  .FirstOrDefaultAsync();

            if (response == null)
            {
                return HttpResult<ConversationDetailsResponse>.Failure("Conversation not found");
            }

            return HttpResult<ConversationDetailsResponse>.Success(response);
        }
    }
}