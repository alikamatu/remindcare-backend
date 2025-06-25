import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Example: Attach a dummy tenant for demonstration
    request.tenant = { id: 'tenant42' };
    return true;
  }
}