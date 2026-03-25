using CleanArchWithCQRSandMediatR.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Commands.UpsertBlogs
{
    public class UpsertBlogCommand : IRequest<List<int>>
    {
        public List<Blog> Blogs { get; set; }
    }
}
