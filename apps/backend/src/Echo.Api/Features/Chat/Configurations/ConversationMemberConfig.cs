using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Chat.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Echo.Api.Features.Chat.Configurations
{
    public class ConversationMemberConfig : IEntityTypeConfiguration<ConversationMember>
    {
        public void Configure(EntityTypeBuilder<ConversationMember> builder)
        {

            builder.HasIndex(m => new { m.ConversationId, m.UserId })
                  .IsUnique();
        }
    }
}