import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1586019120251 implements MigrationInterface {
    name = 'Migration1586019120251'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD "memberId" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD CONSTRAINT "FK_9689dd2fe0bb3272506201f1272" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP CONSTRAINT "FK_9689dd2fe0bb3272506201f1272"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP COLUMN "memberId"`, undefined);
    }

}
