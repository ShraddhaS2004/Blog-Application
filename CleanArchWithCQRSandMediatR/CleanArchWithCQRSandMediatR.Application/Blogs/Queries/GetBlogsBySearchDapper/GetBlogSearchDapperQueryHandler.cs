using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CleanArchWithCQRSandMediatR.Application.Common.Interfaces;
using MediatR;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsBySearchDapper
{
    public class GetBlogSearchDapperQueryHandler : IRequestHandler<GetBlogSearchDapperQuery, List<BlogVm>>
    {
        private readonly IBlogReadRepository _blogRepository;
        private readonly IMapper _mapper;

        public GetBlogSearchDapperQueryHandler(IBlogReadRepository blogRepository, IMapper mapper)
        {
            _blogRepository = blogRepository;
            _mapper = mapper;
        }

        public async Task<List<BlogVm>> Handle(GetBlogSearchDapperQuery request, CancellationToken cancellationToken)
        {
            var blogs = await _blogRepository.SearchBlogsAsync(request.SearchTerm);
            return _mapper.Map<List<BlogVm>>(blogs);
        }
    }
}
