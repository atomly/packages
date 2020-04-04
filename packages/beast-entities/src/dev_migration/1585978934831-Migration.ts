import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1585978934831 implements MigrationInterface {
    name = 'Migration1585978934831'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "public"."members_teams_members" ("membersId_1" integer NOT NULL, "membersId_2" integer NOT NULL, CONSTRAINT "PK_057ee0c8023aa465497bfb11066" PRIMARY KEY ("membersId_1", "membersId_2"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_4f0958ac80686d5195461d0251" ON "public"."members_teams_members" ("membersId_1") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3557a871803f685e9c37e77e5a" ON "public"."members_teams_members" ("membersId_2") `, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members_teams_members" ADD CONSTRAINT "FK_4f0958ac80686d5195461d0251b" FOREIGN KEY ("membersId_1") REFERENCES "public"."members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members_teams_members" ADD CONSTRAINT "FK_3557a871803f685e9c37e77e5a4" FOREIGN KEY ("membersId_2") REFERENCES "public"."members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."members_teams_members" DROP CONSTRAINT "FK_3557a871803f685e9c37e77e5a4"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members_teams_members" DROP CONSTRAINT "FK_4f0958ac80686d5195461d0251b"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_3557a871803f685e9c37e77e5a"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f0958ac80686d5195461d0251"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."members_teams_members"`, undefined);
    }

}
