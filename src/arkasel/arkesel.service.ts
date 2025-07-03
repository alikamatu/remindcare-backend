import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ArkeselService {
  private readonly endpoint = 'https://sms.arkesel.com/sms/api';
  private readonly apiKey = process.env.ARKESSEL_API_KEY;
  private readonly senderName = process.env.ARKESSEL_SENDER_NAME || 'Synchora';
    private normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  if (/^\+233\d{9}$/.test(trimmed)) return trimmed;
  if (/^0\d{9}$/.test(trimmed)) return '+233' + trimmed.slice(1);
  throw new Error('Invalid phone number format. Use international format, e.g. +233XXXXXXXXX');
}

  async sendSms(to: string, message: string): Promise<void> {
    const phone = this.normalizePhone(to);
    if (!this.apiKey) {
      Logger.error('Arkesel API key is missing');
      throw new Error('Arkesel API key is missing');
    }
    if (!this.senderName) {
      Logger.error('Arkesel sender name is missing');
      throw new Error('Arkesel sender name is missing');
    }
    // Optional: Validate phone number format (basic check)
    // Optional: Validate phone number format (basic check)
    if (!/^\+\d{10,15}$/.test(phone)) {
      Logger.error(`Invalid phone number format: ${phone}`);
      throw new Error('Invalid phone number format. Use international format, e.g. +233XXXXXXXXX');
    }

    try {
      const params = {
        action: 'send-sms',
        api_key: this.apiKey,
        to: phone,
        from: this.senderName,
        sms: message,
      };
      const response = await axios.get(this.endpoint, { params });
      const successCodes = ['100', 'ok'];
      if (
        response.data &&
        response.data.code &&
        !successCodes.includes(response.data.code)
      ) {
        Logger.error(`Arkesel SMS error: ${JSON.stringify(response.data)}`);
        throw new Error(response.data.message || 'Failed to send SMS');
      }
    } catch (error) {
      if (error.response) {
        Logger.error(`Arkesel SMS error: ${JSON.stringify(error.response.data)}`);
      } else {
        Logger.error('Arkesel SMS error', error.message);
      }
      throw error;
    }
  }
}