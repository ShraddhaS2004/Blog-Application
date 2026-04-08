using CleanArchWithCQRSandMediatR.Application.Blogs.IQueries;
using CleanArchWithCQRSandMediatR.Application.Blogs.Models.QueryModels;
using CleanArchWithCQRSandMediatR.Application.Common.Interfaces;
using CleanArchWithCQRSandMediatR.Infrastructure.QueryService.QueryHelpers;
using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Infrastructure.QueryService
{
    public class BlogQueryService : IBlogQueryService
    {
        private readonly ISqlConnectionFactory _connectionFactory;
        private readonly IQueryHelper _queryHelper;

        public BlogQueryService(ISqlConnectionFactory connectionFactory, IQueryHelper queryHelper)
        {
            _connectionFactory = connectionFactory;
            _queryHelper = queryHelper;
        }

        public async Task<BlogQueryModel?> GetByIdDapperAsync(int id)
        {
            await using var context = new QueryContext(_connectionFactory);

            var sql = @"SELECT Id, Name, Description, Author, Genre FROM Blogs WITH (NOLOCK) WHERE Id = @Id";

            return await _queryHelper.QueryFirstOrDefaultAsync<BlogQueryModel>(context, sql, new { Id = id });
        }

        public async Task<List<BlogQueryModel>> GetAllDapperAsync()
        {
            await using var context = new QueryContext(_connectionFactory);

            var sql = @"SELECT Id, Name, Description, Author, Genre FROM Blogs WITH (NOLOCK) ORDER BY Id DESC";

            var blogs = await _queryHelper.QueryAsync<BlogQueryModel>(context, sql);
            return blogs.ToList();
        }

        public async Task<List<BlogQueryModel>> SearchBlogsAsync(string searchTerm)
        {
            await using var context = new QueryContext(_connectionFactory);

            var sql = @"SELECT Id, Name, Description, Author, Genre FROM Blogs WITH (NOLOCK)
                WHERE Name LIKE @Search OR Description LIKE @Search OR Author LIKE @Search";

            // Wrap term with '%' for LIKE search
            var blogs = await _queryHelper.QueryAsync<BlogQueryModel>(context, sql, new { Search = $"%{searchTerm}%" });

            return blogs.ToList();
        }
    }
}
