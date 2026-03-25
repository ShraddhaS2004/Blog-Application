using CleanArchWithCQRSandMediatR.Domain.Entities;
using CleanArchWithCQRSandMediatR.Domain.Repository;
using CleanArchWithCQRSandMediatR.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Infrastructure.Repository
{
    public class BlogRepository : IBlogRepsitory
    {
        private readonly BlogDbContext _blogDbContext;
        private readonly SqlConnectionFactory _connectionFactory;

        public BlogRepository(BlogDbContext blogDbContext)
        {
            _blogDbContext = blogDbContext;
        }
        public async Task<Blog> CreateAsync(Blog blog)
        {
            await _blogDbContext.Blogs.AddAsync(blog);
            await _blogDbContext.SaveChangesAsync();
            return blog;
        }

        public async Task<int> DeleteAsync(int id)
        {
            return await _blogDbContext.Blogs
                .Where(model => model.Id == id)
                .ExecuteDeleteAsync();
        }

        public async Task<List<Blog>> GetAllAsync()
        {

            return await _blogDbContext.Blogs.ToListAsync();
        }

        public async Task<Blog> GetByIdAsync(int id)
        {
            return await _blogDbContext.Blogs.AsNoTracking()
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<int> UpdateAsync(int id, Blog blog)
        {
            return await _blogDbContext.Blogs
                .Where(model => model.Id == id)
                .ExecuteUpdateAsync(setters =>
                    setters
                        .SetProperty(model => model.Name, blog.Name)
                        .SetProperty(model => model.Description, blog.Description)
                        .SetProperty(model => model.Author, blog.Author)
                        .SetProperty(model => model.Genre, blog.Genre)
                );
        }

        public async Task<int> DeleteMultipleAsync(List<int> ids)
        {
            return await _blogDbContext.Blogs
                .Where(b => ids.Contains(b.Id))
                .ExecuteDeleteAsync();
        }

        public async Task<List<int>> UpsertMultipleAsync(List<Blog> blogs)
        {
            var resultIds = new List<int>();

            var blogsToUpdate = blogs.Where(b => b.Id > 0).ToList();
            var blogsToCreate = blogs.Where(b => b.Id == 0).ToList();

            foreach (var blog in blogsToUpdate)
            {
                await _blogDbContext.Blogs
                    .Where(b => b.Id == blog.Id)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(b => b.Name, blog.Name)
                        .SetProperty(b => b.Description, blog.Description)
                        .SetProperty(b => b.Author, blog.Author)
                        .SetProperty(b => b.Genre, blog.Genre)
                    );

                resultIds.Add(blog.Id);
            }

            if (blogsToCreate.Any())
            {
                await _blogDbContext.Blogs.AddRangeAsync(blogsToCreate);
                await _blogDbContext.SaveChangesAsync();

                resultIds.AddRange(blogsToCreate.Select(b => b.Id));
            }

            return resultIds;
        }
    }
}
