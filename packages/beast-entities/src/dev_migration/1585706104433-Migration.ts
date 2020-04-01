import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1585706104433 implements MigrationInterface {
    name = 'Migration1585706104433'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "public"."profiles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_d93171d9881ffb7048af75253f3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "profiles_pk" ON "public"."profiles" ("id") `, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "recruiter_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."players" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."players" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD "userId" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."recruiters" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."recruiters" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" ADD "userId" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "playerId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_ca9b41a79b5ba551ddb50649e06" UNIQUE ("playerId")`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "recruiterId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_6352ddaadd7e8ced910502364a0" UNIQUE ("recruiterId")`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD CONSTRAINT "FK_91bfb112fec627083ea40d8ad9e" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" ADD CONSTRAINT "FK_0ef0785c454816d2ec36c81a6f6" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "FK_ca9b41a79b5ba551ddb50649e06" FOREIGN KEY ("playerId") REFERENCES "public"."players"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "FK_6352ddaadd7e8ced910502364a0" FOREIGN KEY ("recruiterId") REFERENCES "public"."recruiters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "FK_6352ddaadd7e8ced910502364a0"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "FK_ca9b41a79b5ba551ddb50649e06"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" DROP CONSTRAINT "FK_0ef0785c454816d2ec36c81a6f6"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP CONSTRAINT "FK_91bfb112fec627083ea40d8ad9e"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_6352ddaadd7e8ced910502364a0"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "recruiterId"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_ca9b41a79b5ba551ddb50649e06"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "playerId"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "created_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" DROP COLUMN "userId"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" DROP COLUMN "updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."teams" DROP COLUMN "created_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."recruiters" DROP COLUMN "updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."recruiters" DROP COLUMN "created_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP COLUMN "userId"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP COLUMN "updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP COLUMN "created_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."players" DROP COLUMN "updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."players" DROP COLUMN "created_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "recruiter_id" integer`, undefined);
        await queryRunner.query(`DROP INDEX "public"."profiles_pk"`, undefined);
        await queryRunner.query(`DROP TABLE "public"."profiles"`, undefined);
    }

}
