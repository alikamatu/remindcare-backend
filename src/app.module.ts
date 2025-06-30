import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Facility } from './facility/facility.entity';
import { Appointment } from './appointment/appointment.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BillingModule } from './billing/billing.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User, Facility, Appointment],
        synchronize: true, // Disable in production
        logging: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    AuthModule,
    UserModule,
    BillingModule,
    WebhookModule,
    // Add other modules here
  ],
})
export class AppModule {}