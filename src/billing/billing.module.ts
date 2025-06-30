import { Module } from '@nestjs/common'
import Stripe from 'stripe'
import Clerk from '@clerk/clerk-sdk-node'
import { BillingService } from './billing.service'
import 'dotenv/config'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

@Module({
  providers: [
    BillingService,
    {
      provide: 'STRIPE',
      useValue: new Stripe(stripeSecretKey, { apiVersion: '2025-05-28.basil' }),
    },
    {
      provide: 'CLERK',
      useValue: Clerk,
    },
  ],
  exports: [BillingService],
})
export class BillingModule {}