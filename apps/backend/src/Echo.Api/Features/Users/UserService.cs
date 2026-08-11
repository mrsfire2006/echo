using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Shared.Infrastructure.Persistence;
using Echo.Api.Features.Users.Dtos.Responses;
using Echo.Api.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace Echo.Api.Features.Users
{
    public class UserService
    {
        private readonly AppDbContext _context;
        public UserService(AppDbContext context)
        {
            _context = context;
        }


        public async Task<HttpResult<GetUserProfileResponse>> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

            if (user == null)
                return HttpResult<GetUserProfileResponse>.Failure("Usere not exist");

            return HttpResult<GetUserProfileResponse>.Success(new GetUserProfileResponse
            (
                user.Id,
                user.Username,
             user.Email
            ));
        }

        


    }
}