import { IsString, IsEmail, IsOptional, IsNumber, IsDateString, Validate } from 'class-validator';

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'phoneFormat', async: false })
export class PhoneFormatValidator implements ValidatorConstraintInterface {
  validate(phone: string, args: ValidationArguments) {
    // Accept +233XXXXXXXXX or 0XXXXXXXXX
    return /^\+233\d{9}$/.test(phone) || /^0\d{9}$/.test(phone);
  }
  defaultMessage(args: ValidationArguments) {
    return 'Phone number must be in +233XXXXXXXXX or 0XXXXXXXXX format';
  }
}

export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Validate(PhoneFormatValidator)
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