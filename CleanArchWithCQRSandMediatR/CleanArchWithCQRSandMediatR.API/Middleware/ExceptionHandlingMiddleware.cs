using FluentValidation;
using System.Net;
using System.Text.Json;

namespace CleanArchWithCQRSandMediatR.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.ContentType = "application/json";

                var errors = ex.Errors
                    .Select(e => new
                    {
                        Property = e.PropertyName,
                        Error = e.ErrorMessage
                    });

                var result = JsonSerializer.Serialize(new
                {
                    Message = "Validation Failed",
                    Errors = errors
                });

                await context.Response.WriteAsync(result);
            }
            catch (Exception)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await context.Response.WriteAsync("An unexpected error occurred.");
            }
        }
    }
}