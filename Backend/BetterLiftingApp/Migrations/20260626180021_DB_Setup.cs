using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BetterLiftingApp.Migrations
{
    /// <inheritdoc />
    public partial class DB_Setup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "exerciseName",
                table: "Exercises",
                newName: "ExerciseName");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Exercises",
                newName: "Id");

            migrationBuilder.AddColumn<int>(
                name: "EquipmentType",
                table: "Exercises",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "MuscleGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExerciseId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MuscleGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MuscleGroup_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: 1,
                column: "EquipmentType",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: 2,
                column: "EquipmentType",
                value: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MuscleGroup_ExerciseId",
                table: "MuscleGroup",
                column: "ExerciseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MuscleGroup");

            migrationBuilder.DropColumn(
                name: "EquipmentType",
                table: "Exercises");

            migrationBuilder.RenameColumn(
                name: "ExerciseName",
                table: "Exercises",
                newName: "exerciseName");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Exercises",
                newName: "id");
        }
    }
}
