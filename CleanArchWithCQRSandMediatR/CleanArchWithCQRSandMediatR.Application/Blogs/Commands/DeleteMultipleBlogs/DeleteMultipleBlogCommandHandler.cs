using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CleanArchWithCQRSandMediatR.Domain.Repository;
using MediatR;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Commands.DeleteMultipleBlogs
{
    public class DeleteMultipleBlogCommandHandler
    : IRequestHandler<DeleteMultipleBlogCommand, int>
    {
        private readonly IBlogRepsitory _blogRepository;

        public DeleteMultipleBlogCommandHandler(IBlogRepsitory blogRepository)
        {
            _blogRepository = blogRepository;
        }

        public async Task<int> Handle(DeleteMultipleBlogCommand request, CancellationToken cancellationToken)
        {
            if (request.Ids == null || !request.Ids.Any())
            {
                return 0;
            }

            return await _blogRepository.DeleteMultipleAsync(request.Ids);
        }
    }
}
