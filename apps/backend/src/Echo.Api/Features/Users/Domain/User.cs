using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Echo.Api.Shared.Common.Base;

namespace Echo.Api.Features.Users.Domain
{
    public class User : AggregateRoot
    {
        public string Email { get; private set; } = default!;

        public string Username { get; private set; } = default!;

        public string PasswordHash { get; private set; } = default!;

        public bool EmailConfirmed { get; private set; } = true;




        public string? Bio { get; private set; }



        private User() : base(Guid.Empty)
        {
        }


        private User(
            Guid id,
            string username,
            string email,
            string passwordHash)
            : base(id)
        {
            Username = username;
            Email = email;
            PasswordHash = passwordHash;
        }


        public static User Create(
            string username,
            string email,
            string passwordHash)
        {
            return new User(
                Guid.NewGuid(),
                username,
                email,
                passwordHash);
        }


        public void ChangePassword(string hash)
        {
            PasswordHash = hash;
        }


        public void ConfirmEmail()
        {
            EmailConfirmed = true;
        }





        public void UpdateProfile(string? bio)
        {
            Bio = bio;
        }
    }
}