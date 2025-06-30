import { Module } from '@nestjs/common'
import Stripe from 'stripe'
import Clerk from '@clerk/clerk-sdk-node'
import { BillingService } from './billing.service'

@Module({
  providers: [
    BillingService,
    {
      provide: 'STRIPE',
      useValue: new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-05-28.basil' }),
    },
    {
      provide: 'CLERK',
      useValue: Clerk,
    },
  ],
  exports: [BillingService],
})
export class BillingModule {}
