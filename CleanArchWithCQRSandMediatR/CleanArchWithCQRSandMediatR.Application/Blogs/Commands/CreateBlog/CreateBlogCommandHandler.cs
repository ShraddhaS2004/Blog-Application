using AutoMapper;
using CleanArchWithCQRSandMediatR.Application.Blogs.Models.ResponseModels;
using CleanArchWithCQRSandMediatR.Application.Blogs.Models.RequestModels;
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
    public class CreateBlogCommandHandler : IRequestHandler<CreateBlogCommand, BlogResponse>
    {
        private readonly IBlogRepsitory _blogRepository;
        private readonly IMapper _mapper;

        public CreateBlogCommandHandler(IBlogRepsitory blogRepository, IMapper mapper)
        {
            _blogRepository = blogRepository;
            _mapper = mapper;
        }
        public async Task<BlogResponse> Handle(CreateBlogCommand request, CancellationToken cancellationToken)
        {
            var blogEntity = new Blog() {
                Name = request.Blog.Name,
                Description = request.Blog.Description,
                Author = request.Blog.Author,
                Genre = request.Blog.Genre
            };
            var result = await _blogRepository.CreateAsync(blogEntity);
            return _mapper.Map<BlogResponse>(result);
        }
    }
}
