// backend/src/auth/auth.controller.ts
import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { Clerk } from '@clerk/clerk-sdk-node';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  private clerk: ReturnType<typeof Clerk>;

  constructor() {
    this.clerk = Clerk({
      secretKey: process.env.CLERK_SECRET_KEY,
      apiUrl: process.env.CLERK_API_URL
    });
  }

  @Post('tenant-signin')
  async tenantSignIn(
    @Body() body: { sessionToken: string, orgId: string },
    @Res() res: Response
  ) {
    try {
      // 1. Verify session
      const session = await this.clerk.sessions.verifySession(body.sessionToken, {});
      
      // 2. Check organization membership
      const memberships = await this.clerk.users.getOrganizationMembershipList({
        userId: session.userId
      });
      
      const hasAccess = memberships.some(m => m.organization.id === body.orgId);
      if (!hasAccess) {
        return res.status(403).json({ message: 'Not a member of this organization' });
      }
      // 3. Create tenant-specific JWT
      const token = jwt.sign(
        {
          sessionId: session.id,
          orgId: body.orgId,
          metadata: {
            role: memberships.find(m => m.organization.id === body.orgId)?.role
          }
        },
        process.env.JWT_SECRET || 'default_secret', // Replace with your actual secret
        { expiresIn: '30d' }
      );
      });

      // 4. Set HTTP-only cookie
      res.cookie('__tenant_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      return res.json({ 
        success: true,
        orgId: body.orgId
      });
    } catch (error) {
      return res.status(401).json({ 
        message: 'Authentication failed',
        error: error.message 
      });
    }
  }

  @Post('tenant-signout')
  async tenantSignOut(@Res() res: Response) {
    res.clearCookie('__tenant_token');
    return res.json({ success: true });
  }
}

function tenantSignOut(arg0: any, res: any, Response: { new(body?: BodyInit | null, init?: ResponseInit): globalThis.Response; prototype: globalThis.Response; error(): globalThis.Response; json(data: any, init?: ResponseInit): globalThis.Response; redirect(url: string | URL, status?: number): globalThis.Response; }) {
    throw new Error('Function not implemented.');
}
