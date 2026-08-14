using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Users.Dtos.Requests;
using Echo.Api.Features.Users.Dtos.Responses;
using Echo.Api.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Echo.Api.Features.Users
{
    [Route("user")]
    public class UserController : ApiControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(typeof(HttpResult<GetUserProfileResponse>), StatusCodes.Status200OK)]

        public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
        {

            if (EnsureAuthenticatedUser(out Guid userId) is IActionResult)
            {
                return HandleResult(HttpResult<GetUserProfileResponse>.Failure("Unauthorized", StatusCodes.Status401Unauthorized));

            }

            var result = await _userService.GetUserByIdAsync(userId, cancellationToken);

            return HandleResult(result);
        }
        [HttpGet("users")]
        [ProducesResponseType(typeof(HttpResult<IEnumerable<GetUserResponse>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUsers([FromQuery] string Username, CancellationToken cancellationToken)
        {

            var result = await _userService.GetUsersAsync(Username, cancellationToken);

            return HandleResult(result);
        }
    }
}