using Echo.Api.Features.Chat.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Echo.Api.Features.Chat.Configurations
{
    public class ConversationConfig : IEntityTypeConfiguration<Conversation>
    {
        public void Configure(EntityTypeBuilder<Conversation> builder)
        {
            builder.HasKey(c => c.Id);



            builder.HasMany(c => c.Messages)
                   .WithOne()
                   .HasForeignKey(m => m.ConversationId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.Members)
                   .WithOne()
                   .HasForeignKey(m => m.ConversationId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}