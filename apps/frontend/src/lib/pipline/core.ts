export type NextDelegate<TResponse> = () => Promise<TResponse>;

export interface HttpResult<T = any> {
  isSuccess: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  errors?: Record<string, string[]> | string[] | null;
}
export interface IPipelineHandler<TRequest, TResponse> {
  handleAsync(
    request: TRequest,
    next: NextDelegate<TResponse>,
  ): Promise<TResponse>;
}

export class PipelineBuilder<TRequest, TResponse> {


  private handlers: IPipelineHandler<TRequest, TResponse>[] = [];

  use(handler: IPipelineHandler<TRequest, TResponse>): this {
    this.handlers.push(handler);
    return this;
  }

  async execute(
    request: TRequest,
    action: (req: TRequest) => Promise<TResponse>,
  ): Promise<TResponse> {
    let index = 0;

    const next: NextDelegate<TResponse> = async () => {
      if (index < this.handlers.length) {
        const handler = this.handlers[index++];
        return await handler.handleAsync(request, next);
      }
      return await action(request);
    };

    return await next();
  }
}
