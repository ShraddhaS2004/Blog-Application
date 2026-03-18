using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanArchWithCQRSandMediatR.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGenreToBlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Genre",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Genre",
                table: "Blogs");
        }
    }
}
