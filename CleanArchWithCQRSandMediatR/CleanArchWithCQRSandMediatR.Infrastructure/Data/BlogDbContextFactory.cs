using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchWithCQRSandMediatR.Infrastructure.Data
{
    public class BlogDbContextFactory : IDesignTimeDbContextFactory<BlogDbContext>
    {
        public BlogDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<BlogDbContext>();

            // Provide your connection string here
            optionsBuilder.UseSqlServer("Server=ITWW009LAP99624;Database=CleanArchWithCQRSandMediatRDb;Trusted_Connection=True;TrustServerCertificate=True;");

            return new BlogDbContext(optionsBuilder.Options);
        }
    }
}
