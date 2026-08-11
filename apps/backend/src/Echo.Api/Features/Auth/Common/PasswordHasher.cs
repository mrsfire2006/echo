using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Echo.Api.Features.Users.Infrastructure.Services
{
    public class PasswordHasher
    {
        public string Hash(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }


        public bool Verify(
            string password,
            string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(
                password,
                passwordHash);
        }
    }
}