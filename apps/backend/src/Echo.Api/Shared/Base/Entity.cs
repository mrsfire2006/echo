using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Shared.Common.Base
{
    public abstract class Entity
    {
        public Guid Id { get; protected set; }

        public Entity(Guid id)
        {
            Id = id;
        }
        public override int GetHashCode()
        {
            return (GetType().GetHashCode() * 31) + this.Id.GetHashCode();
        }
        public override bool Equals(object? obj)
        {
            if (obj is null) return false;
            if (ReferenceEquals(obj, this)) return true;
            if (obj.GetType() != GetType()) return false;

            if (obj is AggregateRoot other)
            {
                if (Id.Equals(default) || other.Id.Equals(default))
                {
                    return false;
                }
                return this.Id.Equals(other.Id);
            }

            return false;
        }
    }
}