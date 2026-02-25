using AutoMapper;
using CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogs;
using CleanArchWithCQRSandMediatR.Domain.Entities;
using CleanArchWithCQRSandMediatR.Domain.Repository;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Commands.CreateBlog
{
    public class CreateBlogCommandHandler : IRequestHandler<CreateBlogCommand, BlogVm>
    {
        private readonly IBlogRepsitory _blogRepository;
        private readonly IMapper _mapper;

        public CreateBlogCommandHandler(IBlogRepsitory blogRepository, IMapper mapper)
        {
            _blogRepository = blogRepository;
            _mapper = mapper;
        }
        public async Task<BlogVm> Handle(CreateBlogCommand request, CancellationToken cancellationToken)
        {
            var blogEntity = new Blog() { Name = request.Name ,Description = request.Description, Author=request.Author};
            var result = await _blogRepository.CreateAsync(blogEntity);
            return _mapper.Map<BlogVm>(result);
        }
    }
}
