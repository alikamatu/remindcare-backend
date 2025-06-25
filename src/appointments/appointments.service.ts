import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from 'src/dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  async createAppointment(tenantId: string, dto: CreateAppointmentDto) {
    // Implement appointment creation logic here
    return { tenantId, ...dto };
  }
}