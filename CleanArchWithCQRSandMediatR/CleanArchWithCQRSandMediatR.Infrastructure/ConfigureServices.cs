using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using CleanArchWithCQRSandMediatR.Infrastructure.Data;
using CleanArchWithCQRSandMediatR.Domain.Repository;
using CleanArchWithCQRSandMediatR.Infrastructure.Repository;



namespace CleanArchWithCQRSandMediatR.Infrastructure
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddInfrastructureServices(
    this IServiceCollection services,
    IConfiguration configuration)
        {
            services.AddDbContext<BlogDbContext>(options =>
            {
            options.UseSqlServer(configuration.GetConnectionString("BlogDbContext") ??
                    throw new InvalidOperationException("connection string 'BlogDbContext' not found"));
            });
            services.AddTransient<IBlogRepsitory, BlogRepository>();
            return services;
        }

    }
}
