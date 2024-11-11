import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration17313379901731337991437 implements MigrationInterface {
    name = 'InitialMigration17313379901731337991437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usersTable" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_7ce5c0fa2f13f85b448ad3216d7" UNIQUE ("email"), CONSTRAINT "PK_d9dbdcaea776085c067cdfb8c81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employeesTable" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "positionId" integer NOT NULL, "positionName" character varying NOT NULL, "managerId" integer, CONSTRAINT "PK_58f6274e4fbcabb618a0d921eda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employeesTable" ADD CONSTRAINT "FK_9bdb37c8db320024c9d5a85396b" FOREIGN KEY ("managerId") REFERENCES "employeesTable"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employeesTable" DROP CONSTRAINT "FK_9bdb37c8db320024c9d5a85396b"`);
        await queryRunner.query(`DROP TABLE "employeesTable"`);
        await queryRunner.query(`DROP TABLE "usersTable"`);
    }

}
