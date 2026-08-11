using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Features.Auth.Common
{
    public static class AuthCookies
    {
        public static void SetAuthCookies(string accessToken, string refreshToken, IHttpContextAccessor httpContextAccessor)
        {
            var response = httpContextAccessor.HttpContext?.Response;

            if (response is null)
            {
                return;
            }

            response.Cookies.Append("access_token", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            });

            response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
        }
    }
}