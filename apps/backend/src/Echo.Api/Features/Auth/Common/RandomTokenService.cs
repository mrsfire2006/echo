using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Echo.Api.Features.Auth.Common
{
    public class RandomTokenService
    {
        public string Create()
        {
            var token =
                Convert.ToBase64String(
                    RandomNumberGenerator.GetBytes(64));

            return token;
        }
    }
}