import { Type } from 'class-transformer';
import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsNumber } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  specialty: string;

  @IsString()
  licenseNumber: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  availability?: Record<string, boolean>;
  
  @Type(() => Number)
  @IsNumber()
  facilityId: number;
}