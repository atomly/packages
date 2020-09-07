import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1586018782093 implements MigrationInterface {
    name = 'Migration1586018782093'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD "memberId" integer NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP COLUMN "memberId"`, undefined);
    }

}
