import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemindersService } from './reminders.service';
import { NotificationService } from './notification.service';
import { Appointment } from 'src/appointment/appointment.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), HttpModule],
  providers: [RemindersService, NotificationService],
  exports: [RemindersService],
})
export class RemindersModule {}