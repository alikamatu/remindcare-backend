import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class TenantService {
  constructor(private readonly connection: DataSource) {}

  async onboardTenant(tenantId: string): Promise<void> {
    await this.connection.query(
      `SELECT create_tenant_schema($1)`,
      [tenantId]
    );

    // Create core tables in tenant schema
    await this.connection.query(`SET search_path TO tenant_${tenantId}`);

    await this.connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL,
        scheduled_at TIMESTAMPTZ NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'scheduled'
      );
      
      CREATE INDEX idx_appointments_patient ON appointments(patient_id);
    `);
  }
}