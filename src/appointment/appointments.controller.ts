import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentFilterDto } from './dto/appointment-filter.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Appointment } from './appointment.entity';
import { AppointmentStatus } from '../shared/constants/appointment.constants';
import { ClerkGuard } from 'src/clerk/clerk.guard';
import { User } from 'src/user/user.decorators';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(ClerkGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created', type: Appointment })
  create(
    @Body() createDto: CreateAppointmentDto,
    @User('sub') userId: string,
  ): Promise<Appointment> {
    return this.appointmentsService.createAppointment(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments with optional filters' })
  @ApiResponse({ status: 200, description: 'List of appointments', type: [Appointment] })
  findAll(
    @Query() filterDto: AppointmentFilterDto,
    @User('sub') userId: string,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findAll(filterDto, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment details', type: Appointment })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(
    @Param('id') id: string,
    @User('sub') userId: string,
  ): Promise<Appointment> {
    return this.appointmentsService.findOne(+id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({ status: 200, description: 'Updated appointment', type: Appointment })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAppointmentDto,
    @User('sub') userId: string,
  ): Promise<Appointment> {
    return this.appointmentsService.update(+id, updateDto, userId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  @ApiResponse({ status: 200, description: 'Status updated', type: Appointment })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @User('sub') userId: string,
  ): Promise<Appointment> {
    return this.appointmentsService.updateStatus(+id, status, userId);
  }

  @Get(':id/risk')
  @ApiOperation({ summary: 'Calculate no-show risk for appointment' })
  @ApiResponse({ status: 200, description: 'Risk assessment completed', type: Appointment })
  calculateRisk(
    @Param('id') id: string,
    @User('sub') userId: string,
  ): Promise<Appointment> {
    return this.appointmentsService.calculateRisk(+id, userId);
  }
}