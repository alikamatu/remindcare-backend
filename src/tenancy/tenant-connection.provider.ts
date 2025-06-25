import { DataSource, DataSourceOptions } from "typeorm";
import { Injectable } from "@nestjs/common";
import "dotenv/config";


@Injectable()
export class TenantConnectionProvider {
  private readonly baseConfig: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: true,
    extra: {
      pool: {
        max: 20, // Connection pool size
      },
    },
  };

  async getConnection(tenantId: string): Promise<DataSource> {
    const options: DataSourceOptions = {
      ...this.baseConfig,
      name: `tenant_${tenantId}_connection`, // Unique connection name
    };

    // Only add schema if using postgres
    if (options.type === "postgres") {
      (options as DataSourceOptions & { schema: string }).schema = `tenant_${tenantId}`;
    }

    const ds = new DataSource(options);

    return ds.initialize();
  }
}