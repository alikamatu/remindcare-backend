// backend/src/clerk/clerk.controller.ts
import { Controller, Post, Header, Headers, Body, BadRequestException } from '@nestjs/common';
import { Webhook } from 'svix';
import { WebhookEvent } from './webhook-event.interface'; // Adjust the import path as needed
import { TenantService } from 'src/tenancy/tenant.service';
import 'dotenv/config'; // Ensure dotenv is configured to load environment variables

@Controller('clerk')
export class ClerkController {
  constructor(private readonly tenantService: TenantService) {} // Ensure TenantService is imported and injected

  @Post('webhooks/clerk')
  @Header('svix-id', '') // Clear header to avoid NestJS interference
  async handleClerkWebhook(
    @Headers() headers: Record<string, string>,
    @Body() body: any
  ) {
    const svixId = headers['svix-id'];
    const svixSignature = headers['svix-signature'];
    const svixTimestamp = headers['svix-timestamp'];

    if (!svixId || !svixSignature || !svixTimestamp) {
      throw new BadRequestException('Missing required headers');
    }

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET environment variable is not set');
    }
    const wh = new Webhook(webhookSecret);
    const payload = wh.verify(body, {
      'svix-id': svixId,
      'svix-signature': svixSignature,
      'svix-timestamp': svixTimestamp,
    }) as WebhookEvent;

    // Handle organization.created events
    if (payload.type === 'organization.created') {
      await this.tenantService.onboardTenant(payload.data.id);
    }

    return { received: true };
  }
}