using CleanArchWithCQRSandMediatR.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Infrastructure.QueryService.QueryHelpers
{
    public class QueryContext : IAsyncDisposable, IQueryContext
    {
        private readonly ISqlConnectionFactory _connectionFactory;
        public IDbConnection Connection { get; }

        public QueryContext(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
            Connection = _connectionFactory.CreateConnection() ?? throw new InvalidOperationException("CreateConnection returned null");
            Connection.Open();
        }

        public async ValueTask DisposeAsync()
        {
            if (Connection != null)
            {
                await Task.Run(() => Connection.Close());
                Connection.Dispose();
            }
        }
    }
}
