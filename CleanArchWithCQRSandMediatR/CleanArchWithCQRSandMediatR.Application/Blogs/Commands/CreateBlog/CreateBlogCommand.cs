using CleanArchWithCQRSandMediatR.Application.Blogs.Models.RequestModels;
using CleanArchWithCQRSandMediatR.Application.Blogs.Models.ResponseModels;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Commands.CreateBlog
{
    public class CreateBlogCommand : IRequest<BlogResponse>
    {
        public BlogRequest Blog { get; set; } = new BlogRequest();
    }
}
