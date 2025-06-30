import { Injectable } from '@nestjs/common';
import { Clerk } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
  private clerk: ReturnType<typeof Clerk>;

  constructor() {
    this.clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY});
  }

  async updateUserMetadata(userId: string, metadata: Record<string, any>) {
    return this.clerk.users.updateUser(userId, { 
      publicMetadata: metadata 
    });
  }

  async verifyToken(token: string) {
    return this.clerk.verifyToken(token);
  }
}