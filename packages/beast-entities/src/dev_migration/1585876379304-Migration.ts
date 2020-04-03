import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1585876379304 implements MigrationInterface {
    name = 'Migration1585876379304'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "public"."posts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "header" text NOT NULL, "body" text NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_8ed8d3bde047700b500cfbf1fef" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "post_pk" ON "public"."posts" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."profiles" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_d93171d9881ffb7048af75253f3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "profiles_pk" ON "public"."profiles" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."teams" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" integer NOT NULL, CONSTRAINT "PK_a920abe6f6dd7764ee0f8108f57" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "teams_pk" ON "public"."teams" ("id") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "email" character varying(255) NOT NULL, "password" text NOT NULL, "firstName" character varying(255), "profileId" integer, CONSTRAINT "UQ_12ffa5c867f6bb71e2690a526ce" UNIQUE ("email"), CONSTRAINT "REL_6cf67f132a67fbdff9bf913ca6" UNIQUE ("profileId"), CONSTRAINT "PK_a6cc71bedf15a41a5f5ee8aea97" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_uq" ON "public"."users" ("email") `, undefined);
        await queryRunner.query(`CREATE TABLE "public"."members" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_33423cc83aa0869b25caff3ab52" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD CONSTRAINT "FK_91bfb112fec627083ea40d8ad9e" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" ADD CONSTRAINT "FK_0ef0785c454816d2ec36c81a6f6" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "FK_6cf67f132a67fbdff9bf913ca64" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "FK_6cf67f132a67fbdff9bf913ca64"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" DROP CONSTRAINT "FK_0ef0785c454816d2ec36c81a6f6"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP CONSTRAINT "FK_91bfb112fec627083ea40d8ad9e"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."members"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."users_uq"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."users"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."teams_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."teams"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."profiles_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."profiles"`, undefined);
        await queryRunner.query(`DROP INDEX "public"."post_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."posts"`, undefined);
    }

}
