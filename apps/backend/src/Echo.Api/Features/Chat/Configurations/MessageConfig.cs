using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Chat.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Echo.Api.Features.Chat.Configurations
{
    public class MessageConfig : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {


            builder.Property(m => m.Content)
                  .IsRequired()
                  .HasMaxLength(4000);

            builder.Property(m => m.CreatedAt)
                   .IsRequired();

            builder.Property(m => m.SenderId)
                   .IsRequired();

            builder.Property(m => m.ConversationId)
                   .IsRequired();

            builder.HasIndex(m => new { m.ConversationId, m.CreatedAt });
        }
    }
}