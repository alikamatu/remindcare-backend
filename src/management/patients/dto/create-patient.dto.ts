// src/management/patients/dto/create-patient.dto.ts
import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  medicalHistory?: {
    allergies: string[];
    conditions: string[];
    medications: string[];
  };

  @IsOptional()
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };

  @IsString()
  language: string;

  @IsNumber()
  facilityId: number;
}