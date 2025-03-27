using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace tktech_bdd.Migrations
{
    /// <inheritdoc />
    public partial class AddAssociationElements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AssociationsElements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ElementId1 = table.Column<int>(type: "INTEGER", nullable: false),
                    ElementId2 = table.Column<int>(type: "INTEGER", nullable: false),
                    Element1Id = table.Column<int>(type: "INTEGER", nullable: false),
                    Element2Id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssociationsElements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AssociationsElements_Elements_Element1Id",
                        column: x => x.Element1Id,
                        principalTable: "Elements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssociationsElements_Elements_Element2Id",
                        column: x => x.Element2Id,
                        principalTable: "Elements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AssociationsElements_Element1Id",
                table: "AssociationsElements",
                column: "Element1Id");

            migrationBuilder.CreateIndex(
                name: "IX_AssociationsElements_Element2Id",
                table: "AssociationsElements",
                column: "Element2Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssociationsElements");
        }
    }
}
