using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Users.Dtos.Responses
{

    public record GetUserProfileResponse
    (
         Guid Id,
         string UserName,
         string Email
     );
}