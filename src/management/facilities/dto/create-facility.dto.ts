import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsNumber } from 'class-validator';

export class CreateFacilityDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  operatingHours?: Record<string, { open: string; close: string }>;
}