import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1744477247897 implements MigrationInterface {
  name = 'Init1744477247897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "node" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "nexts" uuid array NOT NULL, "workflowId" uuid, CONSTRAINT "PK_8c8caf5f29d25264abe9eaf94dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "workflow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_eb5e4cc1a9ef2e94805b676751b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "node" ADD CONSTRAINT "FK_b50749217fbc36ec3f75b4e8d84" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "node" DROP CONSTRAINT "FK_b50749217fbc36ec3f75b4e8d84"`,
    );
    await queryRunner.query(`DROP TABLE "workflow"`);
    await queryRunner.query(`DROP TABLE "node"`);
  }
}
