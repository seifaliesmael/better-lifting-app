using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BetterLiftingApp.Migrations
{
    /// <inheritdoc />
    public partial class RenameRPEtoRIR : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RPE",
                table: "WorkoutSets",
                newName: "RIR");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RIR",
                table: "WorkoutSets",
                newName: "RPE");
        }
    }
}
