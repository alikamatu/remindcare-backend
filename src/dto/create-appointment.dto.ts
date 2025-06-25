export class CreateAppointmentDto {
  patientId: string;
  scheduledAt: Date;
  status?: string;
}