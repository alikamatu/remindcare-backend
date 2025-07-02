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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './doctors.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClerkGuard } from 'src/clerk/clerk.guard';

@ApiTags('Management - Doctors')
@ApiBearerAuth()
@Controller('doctors')
@UseGuards(ClerkGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({ status: 201, description: 'Doctor created', type: Doctor })
  create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'List of doctors', type: [Doctor] })
  findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a doctor by ID' })
  @ApiResponse({ status: 200, description: 'Doctor details', type: Doctor })
  findOne(@Param('id') id: string): Promise<Doctor> {
    return this.doctorsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({ status: 200, description: 'Doctor updated', type: Doctor })
  update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a doctor' })
  @ApiResponse({ status: 204, description: 'Doctor deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.doctorsService.remove(+id);
  }

  @Post('demo')
  @ApiOperation({ summary: 'Generate demo doctors' })
  @ApiResponse({ status: 201, description: 'Demo doctors created', type: [Doctor] })
  generateDemo(): Promise<Doctor[]> {
    return this.doctorsService.generateDemo();
  }
}