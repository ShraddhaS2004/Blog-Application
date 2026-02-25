using AutoMapper;
using CleanArchWithCQRSandMediatR.Domain.Repository;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogs
{
    public class GetBlogQueryHandler : IRequestHandler<GetBlogQuery, List<BlogVm>>
    {
        private readonly IBlogRepsitory _blogRepository;
        private readonly IMapper _mapper;

        public GetBlogQueryHandler(IBlogRepsitory blogRepsitory,IMapper mapper) {
            _blogRepository = blogRepsitory;
            _mapper=mapper;
        }

        public async Task<List<BlogVm>> Handle(GetBlogQuery request, CancellationToken cancellationToken)
        {
            var blogs = await _blogRepository.GetAllAsync();
            //var blogList = blogs.Select(x => new BlogVm
            //{
            //    Author = x.Author,
            //    Description = x.Description,
            //    Id = x.Id,
            //    Name = x.Name
            //}).ToList();
            var blogList=_mapper.Map<List<BlogVm>>(blogs);

            return blogList;
        }
    }
}
