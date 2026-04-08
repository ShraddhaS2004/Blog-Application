using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Commands.DeleteMultipleBlogs
{
    public class DeleteMultipleBlogCommand : IRequest<bool>
    {
        public List<int> Ids { get; set; } = new List<int>();
    }
}
