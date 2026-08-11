

using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
 using Microsoft.AspNetCore.Mvc;

namespace Echo.Api.Shared.Common
{
    [ApiController]
    public class ApiControllerBase : ControllerBase
    {
        protected IActionResult HandleResult<T>(HttpResult<T> result)
        {
            if (result.IsSuccess)
            {
                return result.StatusCode == StatusCodes.Status200OK
                    ? Ok(result)
                    : StatusCode(result.StatusCode, result);
            }

            var errorResponse = HttpResult<object>.Failure(result.ErrorMessage, result.StatusCode);
            return StatusCode(result.StatusCode, errorResponse);
        }

        protected IActionResult HandleResult(HttpResult result)
        {
            if (result.IsSuccess)
            {
                return result.StatusCode == StatusCodes.Status200OK
                    ? Ok(result)
                    : StatusCode(result.StatusCode, result);
            }

            var errorResponse = HttpResult.Failure(result.ErrorMessage, result.StatusCode);
            return StatusCode(result.StatusCode, errorResponse);
        }

        protected bool TryGetCurrentUserId([NotNullWhen(true)] out Guid userId)
        {
            var userIdValue = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdValue, out userId);
        }

        protected IActionResult? EnsureAuthenticatedUser(out Guid userId)
        {
            if (TryGetCurrentUserId(out userId))
            {
                return null;
            }

            userId = Guid.Empty;

            return Unauthorized(HttpResult.Failure("User not found", StatusCodes.Status401Unauthorized));
        }
    }
}