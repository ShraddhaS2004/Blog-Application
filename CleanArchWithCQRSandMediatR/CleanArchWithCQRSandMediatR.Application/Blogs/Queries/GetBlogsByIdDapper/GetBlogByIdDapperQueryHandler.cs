using AutoMapper;
using CleanArchWithCQRSandMediatR.Application.Common.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.Queries.GetBlogsByIdDapper
{
    public class GetBlogByIdDapperQueryHandler : IRequestHandler<GetBlogByIdDapperQuery, BlogVm>
    {
        private readonly ISqlConnectionFactory _connectionFactory;
        private readonly IMapper _mapper;
        private readonly IBlogReadRepository _blogRepository;

        public GetBlogByIdDapperQueryHandler(ISqlConnectionFactory connectionFactory, IMapper mapper, IBlogReadRepository blogRepository)
        {
            _connectionFactory = connectionFactory;
            _mapper = mapper;
            _blogRepository=blogRepository;
        }

        public async Task<BlogVm> Handle(GetBlogByIdDapperQuery request, CancellationToken cancellationToken)
        {
            //await using SqlConnection sqlConnection = _connectionFactory.CreateConnection();

            //var blog =await sqlConnection.QueryFirstOrDefaultAsync<BlogVm>(
            //    "SELECT Id, Name, Author, Description FROM Blogs WHERE Id = @Id",
            //    new { Id = request.Id });
            var blog = await _blogRepository.GetByIdDapperAsync(request.Id);
            return _mapper.Map<BlogVm>(blog);
        }
    }
}
