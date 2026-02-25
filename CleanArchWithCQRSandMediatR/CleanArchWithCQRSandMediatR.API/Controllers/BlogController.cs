using CleanArchWithCQRSandMediatR.Application.Blogs.Commands.CreateBlog;
using CleanArchWithCQRSandMediatR.Application.Blogs.Commands.DeleteBlog;
using CleanArchWithCQRSandMediatR.Application.Blogs.Commands.UpdateBlog;
using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogs;
using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsById;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchWithCQRSandMediatR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ApiControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var blogs = await Mediator.Send(new GetBlogQuery());
            return Ok(blogs);
        }

        [HttpGet("{id}",Name ="GetBlogById")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var blog = await Mediator.Send(new GetBlogByIdQuery() { Id = id });
            if (blog == null)
            {
                return NotFound();
            }
            return Ok(blog);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateBlogCommand command)
        {
            var createdBlog = await Mediator.Send(command);
            return CreatedAtRoute("GetBlogById", new { id = createdBlog.Id }, createdBlog);
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
    }
}
