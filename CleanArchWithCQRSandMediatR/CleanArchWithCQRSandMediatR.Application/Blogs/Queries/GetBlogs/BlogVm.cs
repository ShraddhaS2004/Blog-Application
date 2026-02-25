using CleanArchWithCQRSandMediatR.Domain.Entities;
using CleanArchWithCQRSandMediatR.Application.Common.Mappings;

public class BlogVm : IMapFrom<Blog>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Author { get; set; }
    public string Description { get; set; }
}
