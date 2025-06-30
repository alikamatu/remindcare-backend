import { Inject, Injectable } from '@nestjs/common'
import Clerk from '@clerk/clerk-sdk-node'

@Injectable()
export class BillingService {
  constructor(@Inject('CLERK') private clerk: typeof Clerk) {}

  async userHasFeature(userId: string, feature: string): Promise<boolean> {
    const user = await this.clerk.users.getUser(userId)
    const features = user.publicMetadata?.features as string[] | undefined
    return Array.isArray(features) ? features.includes(feature) : false
  }
}
