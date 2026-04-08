using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Infrastructure.QueryService.QueryHelpers
{
    public interface IQueryHelper
    {
        Task<T?> QueryFirstOrDefaultAsync<T>(IQueryContext context, string sql, object? param = null);
        Task<IEnumerable<T>> QueryAsync<T>(IQueryContext context, string sql, object? param = null);
    }
}
