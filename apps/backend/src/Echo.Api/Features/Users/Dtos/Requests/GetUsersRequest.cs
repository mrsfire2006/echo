using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Users.Dtos.Requests
{
    public record GetUsersRequest(string? Username);
}