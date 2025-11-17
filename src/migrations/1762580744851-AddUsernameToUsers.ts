import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameToUsers1762580744851 implements MigrationInterface {
    name = 'AddUsernameToUsers1762580744851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "UQ_4838cd4fc48a6ff2d4aa01aa646" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "UQ_4838cd4fc48a6ff2d4aa01aa646"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
