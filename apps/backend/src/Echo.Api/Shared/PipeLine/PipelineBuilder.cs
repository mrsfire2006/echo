using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Shared.PipeLine
{
    public class PipelineBuilder<TRequest, TResponse>
    {
        private readonly List<IPipelineHandler<TRequest, TResponse>> _handlers = new();

        public PipelineBuilder<TRequest, TResponse> AddHandler(IPipelineHandler<TRequest, TResponse> handler)
        {
            _handlers.Add(handler);
            return this;
        }
        public PipelineBuilder<TRequest, TResponse> AddHandler<THandler>(IServiceProvider provider)
                where THandler : IPipelineHandler<TRequest, TResponse>
        {
            var handler = provider.GetRequiredService<THandler>();
            _handlers.Add(handler);
            return this;
        }


        public async Task<TResponse> ExecuteAsync(
             TRequest request,
             Func<TRequest, CancellationToken, Task<TResponse>> serviceMethod,
             CancellationToken ct = default)
        {
            Func<Task<TResponse>> current = () => serviceMethod(request, ct);

            foreach (var handler in _handlers.AsEnumerable().Reverse())
            {
                var next = current;
                current = () => handler.HandleAsync(request, next, ct);
            }

            return await current();
        }
    }
}