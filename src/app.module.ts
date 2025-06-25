import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantService } from './tenancy/tenant.service';
import { TenantConnectionProvider } from './tenancy/tenant-connection.provider';
import { Patient } from './entities/patient.entity';
import { TenantMiddleware } from './tenancy/tenant.middleware';
import { createTenantEntityProvider } from './tenancy/tenant-entity.provider';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
      autoLoadEntities: true,
      synchronize: true, // Disable in production after initial setup
    }),
  ],
    providers: [
    TenantConnectionProvider,
    TenantService,
    ...createTenantEntityProvider([Appointment, Patient]),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}