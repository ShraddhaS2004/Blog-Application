using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsByIdDapper
{
    public class GetBlogByIdDapperQuery : IRequest<BlogVm>
    {
        public int Id { get; set; }
    }
}
