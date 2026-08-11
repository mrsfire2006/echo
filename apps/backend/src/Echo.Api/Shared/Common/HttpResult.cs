using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Echo.Api.Shared.Common
{
    public interface IFailureResult<TSelf> where TSelf : IFailureResult<TSelf>
    {
        static abstract TSelf Failure(string errorMessage, int statusCode = 400);
    }
    public class HttpResult : IFailureResult<HttpResult>
    {
        public bool IsSuccess { get; }
        public bool IsFailure => !IsSuccess;
        public string ErrorMessage { get; protected set; } = string.Empty;
        public int StatusCode { get; }

        protected HttpResult(bool isSuccess, string errorMessage, int statusCode)
        {
            IsSuccess = isSuccess;
            ErrorMessage = errorMessage;
            StatusCode = statusCode;

        }

        public static HttpResult Success(int statusCode = 200)
           => new(true, string.Empty, statusCode);

        public static HttpResult Failure(string errorMessage, int statusCode = 400)
            => new(false, errorMessage, statusCode);
    }
    public class HttpResult<T> : HttpResult, IFailureResult<HttpResult<T>>
    {
        public T? Value { get; }

        protected HttpResult(bool isSuccess, T? value, string errorMessage, int statusCode)
                : base(isSuccess, errorMessage, statusCode)
        {
            Value = value;
        }

        public static HttpResult<T> Success(T? value, int statusCode = 200) => new(true, value, string.Empty, statusCode);
        public new static HttpResult<T> Failure(string errorMessage, int statusCode = 400)
                => new(false, default, errorMessage, statusCode);


    }
}