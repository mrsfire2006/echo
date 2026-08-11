using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Auth.Domain;
using Echo.Api.Features.Chat.Domain.Entities;
using Echo.Api.Features.Users.Domain;
using Echo.Api.Shared.Common.Base;
using Microsoft.EntityFrameworkCore;

namespace Echo.Api.Features.Shared.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; } = default!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = default!;
        public DbSet<Conversation> Conversations { get; set; } = default!;

        public AppDbContext(
    DbContextOptions<AppDbContext> options)
    : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(Entity).IsAssignableFrom(entityType.ClrType))
                {
                    modelBuilder.Entity(entityType.ClrType)
                        .Property<Guid>("Id")
                        .ValueGeneratedNever();
                }
            }
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(FeaturesMarker).Assembly);
            base.OnModelCreating(modelBuilder);
        }

    }
}