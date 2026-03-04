using CleanArchWithCQRSandMediatR.Application.Common.Interfaces;
using CleanArchWithCQRSandMediatR.Domain.Repository;
using CleanArchWithCQRSandMediatR.Infrastructure.Data;
using CleanArchWithCQRSandMediatR.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



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
            services.AddScoped<IBlogReadRepository, BlogReadRepository>();
            services.AddScoped<ISqlConnectionFactory, SqlConnectionFactory>();
            return services;
        }

    }
}
