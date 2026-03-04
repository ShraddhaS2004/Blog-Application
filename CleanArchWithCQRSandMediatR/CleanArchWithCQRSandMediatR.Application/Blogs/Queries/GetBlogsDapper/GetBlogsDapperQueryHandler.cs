using AutoMapper;
using CleanArchWithCQRSandMediatR.Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsDapper
{
    public class GetBlogsDapperQueryHandler : IRequestHandler<GetBlogsDapperQuery, List<BlogVm>>
    {
        private readonly ISqlConnectionFactory _connectionFactory;
        private readonly IMapper _mapper;
        private readonly IBlogReadRepository _blogRepository;

        public GetBlogsDapperQueryHandler(ISqlConnectionFactory connectionFactory, IMapper mapper, IBlogReadRepository blogRepository)
        {
            _connectionFactory = connectionFactory;
            _mapper = mapper;
            _blogRepository = blogRepository;
        }
        public async Task<List<BlogVm>> Handle(GetBlogsDapperQuery request, CancellationToken cancellationToken)
        {
            var blogs = await _blogRepository.GetAllDapperAsync();
            var blogList = _mapper.Map<List<BlogVm>>(blogs);

            return blogList;
        }
    }
}
