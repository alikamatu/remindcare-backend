import { IsNotEmpty, IsDateString, IsEnum, IsString } from 'class-validator';
import { AppointmentStatus, AppointmentChannel } from '../../shared/constants/appointment.constants';

export class CreateAppointmentDto {
  @IsNotEmpty()
  patientId: number;

  @IsNotEmpty()
  facilityId: number;

  @IsNotEmpty()
  doctorId: number;

  @IsDateString()
  date: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus = AppointmentStatus.PENDING;

  @IsEnum(AppointmentChannel)
  channel: AppointmentChannel;

  @IsString()
  language: string;
}