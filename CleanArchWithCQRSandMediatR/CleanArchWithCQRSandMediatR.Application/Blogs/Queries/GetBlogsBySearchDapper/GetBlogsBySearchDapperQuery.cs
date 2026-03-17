using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsBySearchDapper
{
    public class GetBlogSearchDapperQuery : IRequest<List<BlogVm>>
    {
        public string SearchTerm { get; set; } = string.Empty;
    }
}
