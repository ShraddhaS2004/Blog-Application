using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Infrastructure.QueryService.QueryHelpers
{
    public class QueryHelper :  IQueryHelper
    {
        public async Task<T?> QueryFirstOrDefaultAsync<T>(IQueryContext context, string sql, object? param = null)
        {
            var result = await context.Connection.QueryFirstOrDefaultAsync<T>(sql, param);
            return result;
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(IQueryContext context, string sql, object? param = null)
        {
            return await context.Connection.QueryAsync<T>(sql, param);
        }
    }
}
