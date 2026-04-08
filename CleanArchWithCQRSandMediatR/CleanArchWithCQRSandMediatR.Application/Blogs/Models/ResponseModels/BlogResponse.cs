using CleanArchWithCQRSandMediatR.Application.Common.Mappings;
using CleanArchWithCQRSandMediatR.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Models.ResponseModels
{
    public class BlogResponse : IMapFrom<Blog>
    {
        public int Id { get; set; } 
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Author { get; set; } = default!;
        public string Genre { get; set; } = default!;
    }
}
