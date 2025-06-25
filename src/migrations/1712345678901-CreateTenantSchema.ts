import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTenantSchema implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION create_tenant_schema(tenant_id TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE format('CREATE SCHEMA IF NOT EXISTS tenant_%I', tenant_id);
        EXECUTE format('GRANT USAGE ON SCHEMA tenant_%I TO authenticator', tenant_id);
        EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA tenant_%I
          GRANT ALL PRIVILEGES ON TABLES TO authenticator', tenant_id);
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION IF EXISTS create_tenant_schema`);
  }
}