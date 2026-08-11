using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Shared.PipeLine
{
    public interface IPipelineHandler<TRequest, TResponse>
    {
        Task<TResponse> HandleAsync(TRequest request, Func<Task<TResponse>> next, CancellationToken ct = default);
    }
}