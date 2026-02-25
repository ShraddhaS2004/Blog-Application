using CleanArchWithCQRSandMediatR.Domain.Entities;
using CleanArchWithCQRSandMediatR.Domain.Repository;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Commands.UpdateBlog
{
    public class UpdateBlogCommandHandler : IRequestHandler<UpdateBlogCommand, int>
    {
        private readonly IBlogRepsitory _blogRepository;

        public UpdateBlogCommandHandler(IBlogRepsitory blogRepsitory)
        {
            _blogRepository = blogRepsitory;
        }
        public async Task<int> Handle(UpdateBlogCommand request, CancellationToken cancellationToken)
        {
            var updateBlogEnitity = new Blog()
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                Author = request.Author
            };
            return await _blogRepository.UpdateAsync(request.Id,updateBlogEnitity);
        }
    }
}
