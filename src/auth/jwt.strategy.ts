import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Clerk } from '@clerk/clerk-sdk-node';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private clerk: ReturnType<typeof Clerk>;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.__tenant_token
      ]),
      secretOrKey: process.env.CLERK_JWT_KEY,
      issuer: 'clerk',
    });
    this.clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
  }

  async validate(payload: any) {
    // Verify the JWT is still valid with Clerk
    try {
      // Use this.clerk.verifyToken to verify the JWT
      await this.clerk.verifyToken(payload.token);
      return {
        userId: payload.sub,
        orgId: payload.orgId,
        role: payload.metadata?.role
      };
    } catch (error) {
      throw new Error('Invalid session');
    }
  }
}