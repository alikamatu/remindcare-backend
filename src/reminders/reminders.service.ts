import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { NotificationService } from './notification.service';
import { AppointmentStatus } from '../shared/constants/appointment.constants';
import { Appointment } from 'src/appointment/appointment.entity';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async sendDueReminders() {
    this.logger.log('Running reminder job...');
    const now = new Date();
    
    try {
      const appointments = await this.appointmentRepository.find({
        where: {
          status: AppointmentStatus.CONFIRMED,
          reminders: {
            time: LessThanOrEqual(now),
            sent: false,
          },
        },
        relations: ['patient'],
      });

      this.logger.log(`Found ${appointments.length} appointments needing reminders`);

      for (const appointment of appointments) {
        for (const reminder of appointment.reminders) {
          if (!reminder.sent && reminder.time <= now) {
            try {
              await this.notificationService.sendReminder(
                appointment.patient.phone,
                reminder.channel,
                appointment,
              );
              
              // Mark as sent
              reminder.sent = true;
              await this.appointmentRepository.save(appointment);
              
              this.logger.log(`Sent ${reminder.channel} reminder for appointment ${appointment.id}`);
            } catch (error) {
              this.logger.error(`Failed to send reminder for appointment ${appointment.id}: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error in reminder job: ${error.message}`);
    }
  }

  async rescheduleReminders(appointmentId: number, newDate: Date) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Generate new reminders based on the new date
    appointment.reminders = this.generateDefaultReminders(
      newDate,
      appointment.channel,
    );

    return this.appointmentRepository.save(appointment);
  }

  private generateDefaultReminders(
    date: Date,
    channel: string,
  ): { time: Date; channel: string; sent: boolean }[] {
    const reminders: { time: Date; channel: string; sent: boolean }[] = [];
    const appointmentDate = new Date(date);
    
    // 24 hours before
    const reminder24h = new Date(appointmentDate);
    reminder24h.setHours(reminder24h.getHours() - 24);
    reminders.push({
      time: reminder24h,
      channel,
      sent: false,
    });
    
    // 2 hours before
    const reminder2h = new Date(appointmentDate);
    reminder2h.setHours(reminder2h.getHours() - 2);
    reminders.push({
      time: reminder2h,
      channel,
      sent: false,
    });
    
    return reminders;
  }
}