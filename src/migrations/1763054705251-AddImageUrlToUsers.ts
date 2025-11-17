import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToUsers1763054705251 implements MigrationInterface {
    name = 'AddImageUrlToUsers1763054705251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "imageUrl" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "imageUrl"`);
    }

}
