using CleanArchWithCQRSandMediatR.Application.Blogs.Commands.CreateBlog;
using CleanArchWithCQRSandMediatR.Application.Blogs.Commands.DeleteBlog;
using CleanArchWithCQRSandMediatR.Application.Blogs.Commands.DeleteMultipleBlogs;
using CleanArchWithCQRSandMediatR.Application.Blogs.Commands.UpdateBlog;
using CleanArchWithCQRSandMediatR.Application.Blogs.Commands.UpsertBlogs;
using CleanArchWithCQRSandMediatR.Application.Blogs.IQueries;
using CleanArchWithCQRSandMediatR.Application.Blogs.Models.QueryModels;
using CleanArchWithCQRSandMediatR.Application.Blogs.Models.RequestModels;
using CleanArchWithCQRSandMediatR.Application.Blogs.Models.ResponseModels;
using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogs;
using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsById;
//using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsByIdDapper;
//using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsBySearchDapper;
//using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsDapper;
using CleanArchWithCQRSandMediatR.Domain.Entities;
using CleanArchWithCQRSandMediatR.Infrastructure.QueryService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CleanArchWithCQRSandMediatR.API.Controllers
{
    

    [Route("[controller]/[action]")]
    [ApiController]
    public class BlogController : ApiControllerBase
    {
        private readonly IBlogQueryService _blogQueryService;
        private readonly ILogger<BlogController> _logger;

        public BlogController(IBlogQueryService blogQueryService, ILogger<BlogController> logger)
        {
            _blogQueryService = blogQueryService;
            _logger = logger;
        }

        //[HttpGet]
        //public async Task<IActionResult> GetAllAsync()
        //{
        //    var blogs = await Mediator.Send(new GetBlogQuery());
        //    return Ok(blogs);
        //}

        [HttpGet]
        public async Task<Results<Ok<IEnumerable<BlogQueryModel>>, NotFound<ErrorResponse>>> GetAllDapperAsync()
        {
            var blogs = await _blogQueryService.GetAllDapperAsync();
            if (blogs == null || !blogs.Any())
            {
                _logger.LogWarning("No blogs found");
                return TypedResults.NotFound(new ErrorResponse
                {
                    Message = "No blogs found",
                    StatusCode = 404
                });
            }
            _logger.LogInformation("{Count} blogs found", blogs.Count());
            return TypedResults.Ok<IEnumerable<BlogQueryModel>>(blogs);

        }

        //[HttpGet("{id}", Name = "GetBlogById")]
        //public async Task<IActionResult> GetByIdAsync(int id)
        //{
        //    var blog = await Mediator.Send(new GetBlogByIdQuery() { Id = id });
        //    if (blog == null)
        //    {
        //        return NotFound(new
        //        {
        //            message = "The blog you're looking for doesn't exist. Please try again.",
        //            statusCode = 404
        //        });
        //    }
        //    return Ok(blog);
        //}

        [HttpGet("{id}", Name = "GetBlogByIdDapper")]
        public async Task<Results<Ok<BlogQueryModel>, NotFound<ErrorResponse>>> GetByIdDapperAsync(int id)
        {
            var blog = await _blogQueryService.GetByIdDapperAsync(id);
            if (blog is null)
            {
                _logger.LogWarning("Blog with Id {Id} not found", id);
                return TypedResults.NotFound(new ErrorResponse
                {
                    Message = "The blog you're looking for doesn't exist.",
                    StatusCode = 404
                });
            }

            _logger.LogInformation("Blog with Id {Id} found", id);
            return TypedResults.Ok(blog);
        }

        [HttpGet("search", Name = "SearchBlogsDapper")]
        public async Task<Results<Ok<IEnumerable<BlogQueryModel>>, BadRequest<ErrorResponse>, NotFound<ErrorResponse>>> SearchBlogsDapperAsync([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
            {
                return TypedResults.BadRequest(new ErrorResponse
                {
                    Message = "Search term cannot be empty",
                    StatusCode = 400
                });
            }

            var blogs = await _blogQueryService.SearchBlogsAsync(term);

            if (blogs == null || !blogs.Any())
            {
                return TypedResults.NotFound(new ErrorResponse
                {
                    Message = "No blogs matched your search term.",
                    StatusCode = 404
                });
            }

            return TypedResults.Ok<IEnumerable<BlogQueryModel>>(blogs);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BlogRequest blogRequest)
        {
            var command = new CreateBlogCommand { Blog = blogRequest };
            var response = await Mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateBlogCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest();
            }

            await Mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await Mediator.Send(new DeleteBlogCommand { Id = id });
            if (result == 0)
            {
                return BadRequest();
            }
            return NoContent();
        }

        [HttpDelete("DeleteMultiple")]
        public async Task<Results<Ok<bool>, BadRequest<ErrorResponse>, NotFound<ErrorResponse>>> DeleteMultiple([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return TypedResults.BadRequest(new ErrorResponse
                {
                    Message = "No IDs provided for deletion",
                    StatusCode = 400
                });
            }

            var success = await Mediator.Send(new DeleteMultipleBlogCommand { Ids = ids });

            if (!success)
            {
                return TypedResults.NotFound(new ErrorResponse
                {
                    Message = "No matching blogs found to delete",
                    StatusCode = 404
                });
            }

            return TypedResults.Ok(true);
        }

        //[HttpPost("Upsert")]
        //public async Task<IActionResult> Upsert([FromBody] List<Blog> blogs)
        //{
        //    var result = await Mediator.Send(new UpsertBlogCommand
        //    {
        //        Blogs = blogs
        //    });

        //    return Ok(result);
        //}
        [HttpPost("Upsert")]
        public async Task<Results<Ok<IEnumerable<int>>, BadRequest<ErrorResponse>>> Upsert([FromBody] List<Blog> blogs)
        {
            if (blogs == null || !blogs.Any())
            {
                return TypedResults.BadRequest(new ErrorResponse
                {
                    Message = "No blogs provided for upsert",
                    StatusCode = 400
                });
            }

            // result is a list of IDs of inserted/updated blogs
            var result = await Mediator.Send(new UpsertBlogCommand { Blogs = blogs });

            return TypedResults.Ok<IEnumerable<int>>(result);
        }
    }
}
