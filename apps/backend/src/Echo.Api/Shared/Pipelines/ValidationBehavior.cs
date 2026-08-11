using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Echo.Api.Shared.Common;
using Echo.Api.Shared.PipeLine;
using FluentValidation;
using FluentValidation.Results;

namespace Echo.Api.Shared.Pipelines
{
    public class ValidationBehavior<TRequest, TResponse> : IPipelineHandler<TRequest, TResponse> where TResponse : IFailureResult<TResponse>
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;

        public ValidationBehavior(
            IEnumerable<IValidator<TRequest>> validators)
        {
            _validators = validators;
        }
        public async Task<TResponse> HandleAsync(TRequest request, Func<Task<TResponse>> next, CancellationToken ct = default)
        {
            if (_validators.Any())
            {
                var context = new ValidationContext<TRequest>(request);

                var errors = new List<ValidationFailure>();

                foreach (var validator in _validators)
                {
                    var result = await validator.ValidateAsync(context);

                    errors.AddRange(result.Errors);
                }

                if (errors.Count > 0)
                {
                    return TResponse.Failure(
                        errors.First().ErrorMessage,
                        400);
                }
            }

            return await next();
        }
    }
}