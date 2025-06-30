import { Controller, Headers, Post, Req, Res } from '@nestjs/common'
import Stripe from 'stripe'
import { Request, Response } from 'express'

@Controller('webhook')
export class WebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-05-28.basil' })

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      )
    } catch (err) {
      console.error(err)
      return res.status(400).send(`Webhook Error`)
    }

    // You can handle different event types here
    if (event.type === 'checkout.session.completed') {
      const data = event.data.object
      // Save to DB or Clerk user metadata
    }

    res.status(200).json({ received: true })
  }
}
