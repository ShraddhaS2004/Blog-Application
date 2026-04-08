using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Infrastructure.QueryService.QueryHelpers
{
    public interface IQueryContext : IAsyncDisposable
    {
        IDbConnection Connection { get; }
    }
}
