using CleanArchWithCQRSandMediatR.Application.Common.Mappings;
using CleanArchWithCQRSandMediatR.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Models.RequestModels
{
    public class BlogRequest : IMapFrom<Blog>
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
    }
}
