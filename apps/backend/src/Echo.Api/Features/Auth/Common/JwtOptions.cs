using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Auth.Common
{
    public class JwtOptions
    {
        public const string SectionName = "Jwt";

        public string Key { get; set; } = default!;

        public string Issuer { get; set; } = default!;

        public string Audience { get; set; } = default!;

        public int ExpirationMinutes { get; set; }
    }
}