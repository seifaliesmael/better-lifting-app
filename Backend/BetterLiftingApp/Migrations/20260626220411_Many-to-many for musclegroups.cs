using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BetterLiftingApp.Migrations
{
    /// <inheritdoc />
    public partial class Manytomanyformusclegroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MuscleGroups_Exercises_ExerciseId",
                table: "MuscleGroups");

            migrationBuilder.DropIndex(
                name: "IX_MuscleGroups_ExerciseId",
                table: "MuscleGroups");

            migrationBuilder.DropColumn(
                name: "ExerciseId",
                table: "MuscleGroups");

            migrationBuilder.CreateTable(
                name: "ExerciseMuscleGroup",
                columns: table => new
                {
                    ExercisesId = table.Column<int>(type: "int", nullable: false),
                    MuscleGroupsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExerciseMuscleGroup", x => new { x.ExercisesId, x.MuscleGroupsId });
                    table.ForeignKey(
                        name: "FK_ExerciseMuscleGroup_Exercises_ExercisesId",
                        column: x => x.ExercisesId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExerciseMuscleGroup_MuscleGroups_MuscleGroupsId",
                        column: x => x.MuscleGroupsId,
                        principalTable: "MuscleGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseMuscleGroup_MuscleGroupsId",
                table: "ExerciseMuscleGroup",
                column: "MuscleGroupsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExerciseMuscleGroup");

            migrationBuilder.AddColumn<int>(
                name: "ExerciseId",
                table: "MuscleGroups",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 1,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 2,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 3,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 4,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 5,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 6,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 7,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 8,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 9,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 10,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 11,
                column: "ExerciseId",
                value: null);

            migrationBuilder.UpdateData(
                table: "MuscleGroups",
                keyColumn: "Id",
                keyValue: 12,
                column: "ExerciseId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_MuscleGroups_ExerciseId",
                table: "MuscleGroups",
                column: "ExerciseId");

            migrationBuilder.AddForeignKey(
                name: "FK_MuscleGroups_Exercises_ExerciseId",
                table: "MuscleGroups",
                column: "ExerciseId",
                principalTable: "Exercises",
                principalColumn: "Id");
        }
    }
}
