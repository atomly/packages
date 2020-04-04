import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1585976471059 implements MigrationInterface {
    name = 'Migration1585976471059'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "FK_abf5fdd20df70598d60dd67cd6d"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "FK_9c3e31cfb5594d2e2f093e47f66"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_abf5fdd20df70598d60dd67cd6"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c3e31cfb5594d2e2f093e47f6"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "PK_def4bf654dfd510b3a1ae6ceb95"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "PK_9c3e31cfb5594d2e2f093e47f66" PRIMARY KEY ("membersId")`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP COLUMN "teamsId"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "PK_9c3e31cfb5594d2e2f093e47f66"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP COLUMN "membersId"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD "teams" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "PK_664204745ac3b2e4f37d94249e5" PRIMARY KEY ("teams")`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD "members" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "PK_664204745ac3b2e4f37d94249e5"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "PK_dd89cf716cb76c6578d2db5e7f4" PRIMARY KEY ("teams", "members")`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_664204745ac3b2e4f37d94249e" ON "public"."teams_members_members" ("teams") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_bb97ce06820e3e5681f1cf6456" ON "public"."teams_members_members" ("members") `, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "FK_664204745ac3b2e4f37d94249e5" FOREIGN KEY ("teams") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "FK_bb97ce06820e3e5681f1cf6456e" FOREIGN KEY ("members") REFERENCES "public"."members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "FK_bb97ce06820e3e5681f1cf6456e"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "FK_664204745ac3b2e4f37d94249e5"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb97ce06820e3e5681f1cf6456"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_664204745ac3b2e4f37d94249e"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "PK_dd89cf716cb76c6578d2db5e7f4"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "PK_664204745ac3b2e4f37d94249e5" PRIMARY KEY ("teams")`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP COLUMN "members"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "PK_664204745ac3b2e4f37d94249e5"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP COLUMN "teams"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD "membersId" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "PK_9c3e31cfb5594d2e2f093e47f66" PRIMARY KEY ("membersId")`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD "teamsId" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "PK_9c3e31cfb5594d2e2f093e47f66"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "PK_def4bf654dfd510b3a1ae6ceb95" PRIMARY KEY ("teamsId", "membersId")`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9c3e31cfb5594d2e2f093e47f6" ON "public"."teams_members_members" ("membersId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_abf5fdd20df70598d60dd67cd6" ON "public"."teams_members_members" ("teamsId") `, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "FK_9c3e31cfb5594d2e2f093e47f66" FOREIGN KEY ("membersId") REFERENCES "public"."members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "FK_abf5fdd20df70598d60dd67cd6d" FOREIGN KEY ("teamsId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

}
