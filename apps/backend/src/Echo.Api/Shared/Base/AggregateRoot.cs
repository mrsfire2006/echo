using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
 
namespace Echo.Api.Shared.Common.Base
{
    public abstract class AggregateRoot : Entity
    {
        public AggregateRoot(Guid id) : base(id)
        {
        }
    }
}