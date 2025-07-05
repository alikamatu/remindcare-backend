import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Appointment } from './appointment/appointment.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BillingModule } from './billing/billing.module';
import { WebhookModule } from './webhook/webhook.module';
import { AppointmentModule } from './appointment/apointment.module';
import { RemindersModule } from './reminders/reminders.module';
import { Patient } from './management/patients/patients.entity';
import { Doctor } from './management/doctors/doctors.entity';
import { Facility } from './management/facilities/facilities.entity';
import { ManagementModule } from './management/management.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [User, Appointment, Patient, Doctor, Facility],
        synchronize: false, // Disable in production
        logging: false,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    AuthModule,
    UserModule,
    BillingModule,
    // WebhookModule,
    // AppointmentModule,
    // RemindersModule,
    ManagementModule,
    // Add other modules here
  ],
})
export class AppModule {}