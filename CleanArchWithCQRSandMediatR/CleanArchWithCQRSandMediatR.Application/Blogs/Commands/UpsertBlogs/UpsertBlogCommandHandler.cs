using CleanArchWithCQRSandMediatR.Domain.Entities;
using CleanArchWithCQRSandMediatR.Domain.Repository;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Commands.UpsertBlogs
{
    public class UpsertMultipleBlogCommandHandler
    : IRequestHandler<UpsertBlogCommand, List<int>>
    {
        private readonly IBlogRepsitory _blogRepository;

        public UpsertMultipleBlogCommandHandler(IBlogRepsitory blogRepository)
        {
            _blogRepository = blogRepository;
        }

        public async Task<List<int>> Handle(UpsertBlogCommand request, CancellationToken cancellationToken)
        {
            return await _blogRepository.UpsertMultipleAsync(request.Blogs);
        }
    }
}
