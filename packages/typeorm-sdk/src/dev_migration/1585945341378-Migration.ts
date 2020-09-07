import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1585945341378 implements MigrationInterface {
    name = 'Migration1585945341378'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."members" ADD "profileId" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members" ADD CONSTRAINT "UQ_4792604fa7cf1d8476f73152cdb" UNIQUE ("profileId")`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "FK_ef594df6bcf761623c8eb59de83"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "memberId" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members" ADD CONSTRAINT "FK_4792604fa7cf1d8476f73152cdb" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "FK_ef594df6bcf761623c8eb59de83" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "FK_ef594df6bcf761623c8eb59de83"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members" DROP CONSTRAINT "FK_4792604fa7cf1d8476f73152cdb"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "memberId" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "FK_ef594df6bcf761623c8eb59de83" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members" DROP CONSTRAINT "UQ_4792604fa7cf1d8476f73152cdb"`, undefined);
        await queryRunner.query(`ALTER TABLE "public"."members" DROP COLUMN "profileId"`, undefined);
    }

}
