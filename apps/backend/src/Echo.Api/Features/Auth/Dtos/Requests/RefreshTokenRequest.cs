using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Echo.Api.Features.Auth.Dtos.Requests
{

    public record RefreshTokenRequest(string RefreshToken);
}