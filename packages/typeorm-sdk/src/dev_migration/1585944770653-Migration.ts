import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1585944770653 implements MigrationInterface {
    name = 'Migration1585944770653'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "public"."members" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_33423cc83aa0869b25caff3ab52" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "public"."posts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "header" text NOT NULL, "body" text NOT NULL, "memberId" integer NOT NULL, CONSTRAINT "PK_8ed8d3bde047700b500cfbf1fef" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "post_pk" ON "public"."posts" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."profiles" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_d93171d9881ffb7048af75253f3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "profiles_pk" ON "public"."profiles" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."teams" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_a920abe6f6dd7764ee0f8108f57" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "teams_pk" ON "public"."teams" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "email" character varying(255) NOT NULL, "password" text NOT NULL, "firstName" character varying(255), "memberId" integer, CONSTRAINT "UQ_12ffa5c867f6bb71e2690a526ce" UNIQUE ("email"), CONSTRAINT "REL_ef594df6bcf761623c8eb59de8" UNIQUE ("memberId"), CONSTRAINT "PK_a6cc71bedf15a41a5f5ee8aea97" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_uq" ON "public"."users" ("email") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."teams_members_members" ("teamsId" integer NOT NULL, "membersId" integer NOT NULL, CONSTRAINT "PK_def4bf654dfd510b3a1ae6ceb95" PRIMARY KEY ("teamsId", "membersId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_abf5fdd20df70598d60dd67cd6" ON "public"."teams_members_members" ("teamsId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9c3e31cfb5594d2e2f093e47f6" ON "public"."teams_members_members" ("membersId") `, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD CONSTRAINT "FK_9689dd2fe0bb3272506201f1272" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "FK_ef594df6bcf761623c8eb59de83" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "FK_abf5fdd20df70598d60dd67cd6d" FOREIGN KEY ("teamsId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" ADD CONSTRAINT "FK_9c3e31cfb5594d2e2f093e47f66" FOREIGN KEY ("membersId") REFERENCES "public"."members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "FK_9c3e31cfb5594d2e2f093e47f66"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams_members_members" DROP CONSTRAINT "FK_abf5fdd20df70598d60dd67cd6d"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "FK_ef594df6bcf761623c8eb59de83"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP CONSTRAINT "FK_9689dd2fe0bb3272506201f1272"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c3e31cfb5594d2e2f093e47f6"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."IDX_abf5fdd20df70598d60dd67cd6"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."teams_members_members"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."users_uq"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."users"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."teams_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."teams"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."profiles_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."profiles"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."post_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."posts"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."members"`, undefined);
    }

}
