using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Shared.Common.Base;

namespace Echo.Api.Features.Auth.Domain
{
    public class RefreshToken : AggregateRoot
    {

        public string Token { get; private set; } = default!;

        public DateTime ExpiresAt { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public bool IsRevoked { get; private set; }
        public Guid UserId { get; private set; }


        private RefreshToken() : base(Guid.Empty)
        {
        }

        private RefreshToken(
            Guid id,
            Guid userId,
            string token,
            DateTime expiresAt)
            : base(id)
        {
            UserId = userId;
            Token = token;
            ExpiresAt = expiresAt;
            CreatedAt = DateTime.UtcNow;
        }


        public static RefreshToken Create(
            Guid userId,
            string token,
            int days)
        {
            return new RefreshToken(
                Guid.NewGuid(),
                userId,
                token,
                DateTime.UtcNow.AddDays(days));
        }


        public bool IsExpired()
        {
            return DateTime.UtcNow >= ExpiresAt;
        }


        public void Revoke()
        {
            IsRevoked = true;
        }
    }
}