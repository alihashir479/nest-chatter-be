import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChats1762066205850 implements MigrationInterface {
    name = 'AddChats1762066205850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chats" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "isPrivate" boolean NOT NULL, "userIds" integer array NOT NULL, "name" character varying, CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "chats"`);
    }

}
