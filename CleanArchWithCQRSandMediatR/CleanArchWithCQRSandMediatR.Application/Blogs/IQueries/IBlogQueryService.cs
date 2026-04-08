using CleanArchWithCQRSandMediatR.Application.Blogs.Models.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Application.Blogs.IQueries
{
    public interface IBlogQueryService
    {
        Task<BlogQueryModel?> GetByIdDapperAsync(int id);

        Task<List<BlogQueryModel>> GetAllDapperAsync();
        Task<List<BlogQueryModel>> SearchBlogsAsync(string searchTerm);
    }
}
