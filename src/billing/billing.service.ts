import { Inject, Injectable } from '@nestjs/common'
import Clerk from '@clerk/clerk-sdk-node'

@Injectable()
export class BillingService {
  constructor(@Inject('CLERK') private clerk: typeof Clerk) {}

  async userHasFeature(userId: string, feature: string): Promise<boolean> {
    const user = await this.clerk.users.getUser(userId)
    const features = user.publicMetadata?.features
    return Array.isArray(features) ? features.includes(feature) : false
  }

async getUserPlan(userId: string): Promise<string> {
  const user = await this.clerk.users.getUser(userId)
  const plan = user.publicMetadata?.plan
  return typeof plan === 'string' ? plan : 'free'
}
}