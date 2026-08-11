using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Auth.Dtos.Requests
{

    public record RefreshTokenRequest(string RefreshToken);
}