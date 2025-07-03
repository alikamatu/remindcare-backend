import { Injectable } from '@nestjs/common'
import { Twilio } from 'twilio'

@Injectable()
export class TwilioService {
  private client: Twilio

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    )
  }

  async sendSms(to: string, body: string): Promise<void> {
    await this.client.messages.create({
      body,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    })
  }
}
