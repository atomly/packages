import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1585696452635 implements MigrationInterface {
    name = 'Migration1585696452635'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "public"."players" ("id" SERIAL NOT NULL, CONSTRAINT "PK_06fd6e7be86cfe8baefe733a450" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "players_pk" ON "public"."players" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."posts" ("id" SERIAL NOT NULL, "header" text NOT NULL, "body" text NOT NULL, CONSTRAINT "PK_8ed8d3bde047700b500cfbf1fef" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "post_pk" ON "public"."posts" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."recruiters" ("id" SERIAL NOT NULL, CONSTRAINT "PK_3a93a23d8881b720b5602308b01" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "recruiters_pk" ON "public"."recruiters" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."teams" ("id" SERIAL NOT NULL, CONSTRAINT "PK_a920abe6f6dd7764ee0f8108f57" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "teams_pk" ON "public"."teams" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" text NOT NULL, "recruiter_id" integer, "first_name" character varying(255), CONSTRAINT "UQ_12ffa5c867f6bb71e2690a526ce" UNIQUE ("email"), CONSTRAINT "PK_a6cc71bedf15a41a5f5ee8aea97" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_uq" ON "public"."users" ("email") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "public"."users_uq"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."users"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."teams_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."teams"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."recruiters_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."recruiters"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."post_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."posts"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."players_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."players"`, undefined);
    }

}
