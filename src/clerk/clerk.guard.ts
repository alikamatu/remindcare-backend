import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class ClerkGuard implements CanActivate {
  private jwksClient = jwksRsa({
    jwksUri: `${process.env.CLERK_ISSUER}/.well-known/jwks.json`,
    cache: true,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header) throw new UnauthorizedException('Invalid token');

    const key = await this.jwksClient.getSigningKey(decoded.header.kid);
    const verified = jwt.verify(token, key.getPublicKey(), {
      algorithms: ['RS256'],
      issuer: process.env.CLERK_ISSUER,
    });

    if (typeof verified !== 'object' || verified === null) {
      throw new UnauthorizedException('Invalid token payload');
    }

    req.user = { ...(verified as object), clerkUserId: (verified as any).sub };
    return true;
  }
}