﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace Clockwork.API.Migrations
{
    public partial class TimeZone : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TimeZone",
                table: "CurrentTimeQueries",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeZone",
                table: "CurrentTimeQueries");
        }
    }
}
