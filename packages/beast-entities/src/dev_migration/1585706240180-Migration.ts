import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1585706240180 implements MigrationInterface {
    name = 'Migration1585706240180'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "profileId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_6cf67f132a67fbdff9bf913ca64" UNIQUE ("profileId")`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "FK_6cf67f132a67fbdff9bf913ca64" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "FK_6cf67f132a67fbdff9bf913ca64"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_6cf67f132a67fbdff9bf913ca64"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "profileId"`, undefined);
    }

}
