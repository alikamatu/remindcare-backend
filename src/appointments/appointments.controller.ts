// backend/src/appointments/appointments.controller.ts
import { Controller, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { TenantRequest } from 'src/common/interfaces/tenant-request.interface';
import { CreateAppointmentDto } from 'src/dto/create-appointment.dto';
import { DataSource } from 'typeorm';

@Controller('appointments')
@UseGuards(TenantGuard) // Your custom guard
export class AppointmentsController {
  constructor(
    private readonly service: AppointmentsController,
    @InjectConnection() private connection: DataSource
  ) {}

  @Post()
  async create(
    @Body() dto: CreateAppointmentDto,
    @Req() req: TenantRequest // Custom request type
  ) {
    if (!req.tenant) {
      throw new BadRequestException('Tenant context missing')
    }

    return this.createAppointment(req.tenant.id, dto)
  }

  async createAppointment(tenantId: string, dto: CreateAppointmentDto) {
    // Implement your appointment creation logic here
    // For example, you might use this.connection to interact with the database
    // Return a placeholder for now
    return { tenantId, ...dto };
  }
}