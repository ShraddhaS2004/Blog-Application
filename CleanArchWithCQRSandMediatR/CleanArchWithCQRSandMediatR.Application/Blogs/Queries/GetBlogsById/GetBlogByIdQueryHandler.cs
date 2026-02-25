using AutoMapper;
using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogs;
using CleanArchWithCQRSandMediatR.Domain.Repository;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsById
{
    public class GetBlogByIdQueryHandler : IRequestHandler<GetBlogByIdQuery, BlogVm>
    {
        private readonly IBlogRepsitory _blogRepository;
        private readonly IMapper _mapper;

        public GetBlogByIdQueryHandler(IBlogRepsitory blogRepository, IMapper mapper)
        {
            _blogRepository = blogRepository;
            _mapper = mapper;
        }
        public async Task<BlogVm> Handle(GetBlogByIdQuery request, CancellationToken cancellationToken)
        {
            var blog = await _blogRepository.GetByIdAsync(request.Id);
            return _mapper.Map<BlogVm>(blog);
        }
    }
}
