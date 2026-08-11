using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Features.Auth.Dtos.Requests;
using Echo.Api.Shared.Common;
using Echo.Api.Shared.PipeLine;
using Echo.Api.Shared.Pipelines;
using Microsoft.AspNetCore.Mvc;

namespace Echo.Api.Features.Auth
{
    [Route("auth")]
    public class AuthController : ApiControllerBase
    {
        private readonly AuthService _service;
        private readonly IServiceProvider _provider;

        public AuthController(AuthService service, IServiceProvider provider)
        {
            _service = service;
            _provider = provider;
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(HttpResult), StatusCodes.Status200OK)]
        public async Task<IActionResult> Register(
    [FromBody]
    RegisterUserRequest command,
CancellationToken cancellationToken)
        {
            var pipeline = new PipelineBuilder<RegisterUserRequest, HttpResult>()
                        .AddHandler<ValidationBehavior<RegisterUserRequest, HttpResult>>(_provider)
                        ;

            var result = await pipeline.ExecuteAsync(command, _service.Register, cancellationToken);


            return HandleResult(result);
        }
        [HttpPost("login")]
        [ProducesResponseType(typeof(HttpResult), StatusCodes.Status200OK)]

        public async Task<IActionResult> Login([FromBody]
    LoginUserRequest command,
    CancellationToken cancellationToken)
        {
            var pipeline = new PipelineBuilder<LoginUserRequest, HttpResult>()
                        .AddHandler<ValidationBehavior<LoginUserRequest, HttpResult>>(_provider)
                        ;
            var result = await pipeline.ExecuteAsync(command, _service.Login, cancellationToken);


            return HandleResult(result);
        }


        [HttpPost("refresh")]
        [ProducesResponseType(typeof(HttpResult), StatusCodes.Status200OK)]

        public async Task<IActionResult> Refresh(
            CancellationToken cancellationToken)
        {
            var refreshToken = Request.Cookies["refresh_token"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return HandleResult(HttpResult.Failure(
                    "Refresh token is required.",
                    StatusCodes.Status401Unauthorized));
            }

            var command = new RefreshTokenRequest(refreshToken);

            var result = await _service.Refresh(command, cancellationToken);

            return HandleResult(result);
        }
    }
}