import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Appointment } from 'src/appointment/appointment.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private httpService: HttpService) {}

  async sendReminder(phone: string, channel: string, appointment: Appointment) {
    const message = this.createReminderMessage(appointment);
    
    try {
      let response;
      
      switch (channel) {
        case 'SMS':
          response = await this.sendSMS(phone, message);
          break;
        case 'IVR':
          response = await this.makeIVRCall(phone, message);
          break;
        case 'USSD':
          response = await this.sendUSSD(phone, message);
          break;
        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }
      
      this.logger.log(`Notification sent via ${channel} to ${phone}: ${response}`);
      return { success: true, response };
    } catch (error) {
      this.logger.error(`Failed to send ${channel} notification: ${error.message}`);
      throw error;
    }
  }

  private createReminderMessage(appointment: Appointment): string {
    const date = new Date(appointment.date).toLocaleString();
    return `Reminder: You have an appointment with ${appointment.doctor.firstName} ${appointment.doctor.lastName} at ${appointment.facility.name} on ${date}.`;
  }

  private async sendSMS(phone: string, message: string) {
    // Implementation with Twilio or other SMS provider
    // This is a mock implementation
    const url = 'https://api.twilio.com/2010-04-01/Accounts/ACXXXX/Messages.json';
    const data = new URLSearchParams();
    data.append('To', phone);
    data.append('From', '+1234567890');
    data.append('Body', message);

    const response = await firstValueFrom(
      this.httpService.post(url, data, {
        auth: {
          username: 'ACXXXX',
          password: 'your_auth_token',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    return response.data;
  }

  private async makeIVRCall(phone: string, message: string) {
    // Implementation with Twilio or other IVR provider
    // This is a mock implementation
    return { callSid: 'CAXXXX', status: 'queued' };
  }

  private async sendUSSD(phone: string, message: string) {
    // Implementation with USSD gateway provider
    // This is a mock implementation
    return { sessionId: 'USSDXXXX', status: 'sent' };
  }
}