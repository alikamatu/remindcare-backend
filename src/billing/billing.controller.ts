import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { BillingService } from './billing.service'
import { UserService } from '../user/user.service'
import { ClerkGuard } from 'src/clerk/clerk.guard'

@Controller('billing')
export class BillingController {
  constructor(
    private billingService: BillingService,
    private userService: UserService,
  ) {}

  @UseGuards(ClerkGuard)
  @Post('session')
  async syncBilling(@Req() req, @Body() body) {
    const { sub: userId } = req.user
    const plan = await this.billingService.getUserPlan(userId)

    await this.userService.updateUserPlan(userId, plan)

    return { message: 'Billing synced', plan }
  }
}
