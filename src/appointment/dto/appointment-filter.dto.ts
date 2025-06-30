import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { AppointmentStatus, AppointmentChannel } from '../../shared/constants/appointment.constants';

export class AppointmentFilterDto {
  @IsOptional()
  patientName?: string;

  @IsOptional()
  facilityId?: number;

  @IsOptional()
  doctorId?: number;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsEnum(AppointmentChannel)
  channel?: AppointmentChannel;

  @IsOptional()
  language?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  riskLevel?: string;
}