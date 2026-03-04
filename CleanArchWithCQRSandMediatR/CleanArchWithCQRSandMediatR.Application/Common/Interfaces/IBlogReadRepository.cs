public interface IBlogReadRepository
{
    Task<BlogVm?> GetByIdDapperAsync(int id);

    Task<List<BlogVm>> GetAllDapperAsync();
}