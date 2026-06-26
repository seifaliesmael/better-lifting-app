using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BetterLiftingApp.Migrations
{
    /// <inheritdoc />
    public partial class properonetomanyforexercises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExerciseMuscleGroup_Exercises_ExercisesId",
                table: "ExerciseMuscleGroup");

            migrationBuilder.RenameColumn(
                name: "ExercisesId",
                table: "ExerciseMuscleGroup",
                newName: "ExerciseId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExerciseMuscleGroup_Exercises_ExerciseId",
                table: "ExerciseMuscleGroup",
                column: "ExerciseId",
                principalTable: "Exercises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExerciseMuscleGroup_Exercises_ExerciseId",
                table: "ExerciseMuscleGroup");

            migrationBuilder.RenameColumn(
                name: "ExerciseId",
                table: "ExerciseMuscleGroup",
                newName: "ExercisesId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExerciseMuscleGroup_Exercises_ExercisesId",
                table: "ExerciseMuscleGroup",
                column: "ExercisesId",
                principalTable: "Exercises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
