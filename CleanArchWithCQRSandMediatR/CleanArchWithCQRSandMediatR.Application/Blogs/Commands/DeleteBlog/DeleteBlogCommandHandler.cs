using CleanArchWithCQRSandMediatR.Domain.Repository;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Commands.DeleteBlog
{
    public class DeleteBlogCommandHandler : IRequestHandler<DeleteBlogCommand, int>
    {
        private readonly IBlogRepsitory _blogRepository;

        public DeleteBlogCommandHandler(IBlogRepsitory blogRepsitory)
        {
            _blogRepository=blogRepsitory;
        }
        public async Task<int> Handle(DeleteBlogCommand request, CancellationToken cancellationToken)
        {
            return await _blogRepository.DeleteAsync(request.Id);
        }
    }
}
