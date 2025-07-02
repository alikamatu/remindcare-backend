import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  UseGuards 
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './patients.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClerkGuard } from 'src/clerk/clerk.guard';
import { User } from 'src/user/user.decorators';
import { User as UserType } from 'src/user/user.entity';

@ApiTags('Management - Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(ClerkGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created', type: Patient })
  create(
    @Body() createPatientDto: CreatePatientDto,
    @User('clerkUserId') clerkUserId: string,
  ): Promise<Patient> {
    return this.patientsService.create(createPatientDto, clerkUserId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of patients', type: [Patient] })
  findAll(@User('clerkUserId') clerkUserId: string): Promise<Patient[]> {
    return this.patientsService.findAll(clerkUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient details', type: Patient })
  findOne(
    @Param('id') id: string,
    @User('clerkUserId') clerkUserId: string,
  ): Promise<Patient> {
    return this.patientsService.findOne(+id, clerkUserId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({ status: 200, description: 'Patient updated', type: Patient })
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @User('clerkUserId') clerkUserId: string,
  ): Promise<Patient> {
    return this.patientsService.update(+id, updatePatientDto, clerkUserId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient' })
  @ApiResponse({ status: 204, description: 'Patient deleted' })
  remove(
    @Param('id') id: string,
    @User('clerkUserId') clerkUserId: string,
  ): Promise<void> {
    return this.patientsService.remove(+id, clerkUserId);
  }

  @Post('demo')
  @ApiOperation({ summary: 'Generate demo patients' })
  @ApiResponse({ status: 201, description: 'Demo patients created', type: [Patient] })
  generateDemo(@User('clerkUserId') clerkUserId: string): Promise<Patient[]> {
    return this.patientsService.generateDemo(clerkUserId);
  }
}