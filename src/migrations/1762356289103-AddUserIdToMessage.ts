import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToMessage1762356289103 implements MigrationInterface {
    name = 'AddUserIdToMessage1762356289103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "userId" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "userId"`);
    }

}
