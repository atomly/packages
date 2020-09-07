import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1586019243038 implements MigrationInterface {
    name = 'Migration1586019243038'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."posts" DROP COLUMN "postedBy"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."posts" ADD "postedBy" integer NOT NULL`, undefined);
    }

}
