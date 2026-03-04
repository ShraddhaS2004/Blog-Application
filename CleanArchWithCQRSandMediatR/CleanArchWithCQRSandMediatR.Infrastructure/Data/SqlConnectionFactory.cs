using CleanArchWithCQRSandMediatR.Application.Common.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace CleanArchWithCQRSandMediatR.Infrastructure.Data
{
    public class SqlConnectionFactory : ISqlConnectionFactory
    {
        private readonly string _connectionString;

        public SqlConnectionFactory(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("BlogDbContext");
        }

        public IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);
    }
}
