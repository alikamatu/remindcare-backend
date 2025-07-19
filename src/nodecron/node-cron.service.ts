import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppointmentsService } from 'src/appointment/appointments.service';

@Injectable()
export class ReminderScheduler implements OnModuleInit {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  async onModuleInit() {
    // You can call the sendReminders method here if needed
  }

  @Cron('0 9 * * *') // Every day at 9 AM
  async handleCron() {
    await this.appointmentsService.sendReminders();
  }
}