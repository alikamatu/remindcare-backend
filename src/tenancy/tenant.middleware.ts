import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { Clerk } from "@clerk/clerk-sdk-node";

// Extend Express Request interface to include tenant property
declare module "express-serve-static-core" {
  interface Request {
    tenant?: {
      id: string;
      name: string;
      slug: string;
    };
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY! });

  async use(req: Request, res: Response, next: NextFunction) {
    const orgId = req.headers["x-org-id"] as string;
    
    if (!orgId) {
      return res.status(401).json({ message: "Tenant not identified" });
    }

    // Verify organization exists
    const org = await this.clerk.organizations.getOrganization({ organizationId: orgId });
    if (!org) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Attach tenant context
    req.tenant = {
      id: orgId,
      name: org.name,
      slug: org.slug ?? "",
    };

    next();

    console.log('Tenant Context:', {
  method: req.method,
  path: req.path,
  tenantId: req.tenant?.id,
  userAgent: req.headers['user-agent']
});
  }
}