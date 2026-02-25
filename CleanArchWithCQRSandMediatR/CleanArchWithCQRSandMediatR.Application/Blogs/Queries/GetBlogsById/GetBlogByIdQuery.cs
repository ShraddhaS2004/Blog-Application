using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsById
{
    public class GetBlogByIdQuery : IRequest<BlogVm>
    {
        public int Id { get; set; }

    }
}
