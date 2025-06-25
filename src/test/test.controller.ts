// backend/src/test/test.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
// Define TenantRequest interface if not imported from elsewhere
interface TenantRequest extends Request {
  tenant?: string;
}
// import { TenantRequest } from 'path-to-tenant-request';

@Controller('test')
export class TestController {
  @Get('tenant')
  testTenant(@Req() req: TenantRequest) {
    return {
      message: 'Success',
      tenant: req.tenant,
      timestamp: new Date().toISOString()
    }
  }
}