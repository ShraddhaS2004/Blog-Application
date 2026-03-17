using CleanArchWithCQRSandMediatR.Application.Common.Interfaces;
using Dapper;
using System.Data; 

public class BlogReadRepository : IBlogReadRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public BlogReadRepository(ISqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<BlogVm?> GetByIdDapperAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();

        var sql = "SELECT Id, Name, Description, Author FROM Blogs WHERE Id = @Id";

        return await connection.QueryFirstOrDefaultAsync<BlogVm>(sql, new { Id = id });
    }

    public async Task<List<BlogVm?>> GetAllDapperAsync()
    {
        using var connection=_connectionFactory.CreateConnection();

        var sql = "SELECT * FROM Blogs";

        var blogs= await connection.QueryAsync<BlogVm>(sql, new { Id = 0 });

        return blogs.ToList();
    }

    public async Task<List<BlogVm>> SearchBlogsAsync(string searchTerm)
    {
        using var connection = _connectionFactory.CreateConnection();

        var sql = @"SELECT * FROM Blogs 
                WHERE Name LIKE @Search OR Description LIKE @Search";

        // Wrap term with '%' for LIKE search
        var blogs = await connection.QueryAsync<BlogVm>(sql, new { Search = $"%{searchTerm}%" });

        return blogs.ToList();
    }
}