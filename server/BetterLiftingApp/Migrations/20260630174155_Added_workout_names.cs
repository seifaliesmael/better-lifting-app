using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BetterLiftingApp.Migrations
{
    /// <inheritdoc />
    public partial class Added_workout_names : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "Workouts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "name",
                table: "Workouts");
        }
    }
}
