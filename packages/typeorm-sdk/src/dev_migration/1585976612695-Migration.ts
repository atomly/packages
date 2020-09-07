import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1585976612695 implements MigrationInterface {
    name = 'Migration1585976612695'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "public"."members_teams_teams" ("membersId" integer NOT NULL, "teamsId" integer NOT NULL, CONSTRAINT "PK_3ec7a90810e6623f4e34758b18f" PRIMARY KEY ("membersId", "teamsId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_48d4ef6a597d6f253d3ca2bf8c" ON "public"."members_teams_teams" ("membersId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_75fc2263e3f6ad5c674993a274" ON "public"."members_teams_teams" ("teamsId") `, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members_teams_teams" ADD CONSTRAINT "FK_48d4ef6a597d6f253d3ca2bf8c2" FOREIGN KEY ("membersId") REFERENCES "public"."members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members_teams_teams" ADD CONSTRAINT "FK_75fc2263e3f6ad5c674993a274b" FOREIGN KEY ("teamsId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."members_teams_teams" DROP CONSTRAINT "FK_75fc2263e3f6ad5c674993a274b"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members_teams_teams" DROP CONSTRAINT "FK_48d4ef6a597d6f253d3ca2bf8c2"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_75fc2263e3f6ad5c674993a274"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_48d4ef6a597d6f253d3ca2bf8c"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."members_teams_teams"`, undefined);
    }

}
