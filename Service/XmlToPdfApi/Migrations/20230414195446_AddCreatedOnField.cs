using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XmlToPdfApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedOnField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "SavedFiles",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UniqueFileName",
                table: "SavedFiles",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "SavedFiles");

            migrationBuilder.DropColumn(
                name: "UniqueFileName",
                table: "SavedFiles");
        }
    }
}
