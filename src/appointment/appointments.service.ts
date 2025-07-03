import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentFilterDto } from './dto/appointment-filter.dto';
import { RiskLevel } from '../shared/constants/risk.constants';
import { AppointmentStatus } from 'src/shared/constants/appointment.constants';
import { Patient } from 'src/management/patients/patients.entity';
import { ArkeselService } from 'src/arkasel/arkesel.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly arkasel: ArkeselService,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient) // <-- Add this!
    private patientRepository: Repository<Patient>,
  ) {}
  

async createAppointment(
  createDto: CreateAppointmentDto,
  userId: string,
): Promise<Appointment> {
  if (!createDto.date) {
    throw new Error('date is required');
  }
  const appointment = this.appointmentRepository.create({
    ...createDto,
    userId,
  });

  appointment.reminders = this.generateDefaultReminders(
    new Date(createDto.date),
    createDto.channel,
  );

  appointment.history = [
    {
      event: 'CREATED',
      timestamp: new Date(),
      details: { by: userId },
    },
  ];

  const savedAppointment = await this.appointmentRepository.save(appointment);

  // Fetch patient details using patientId from the form
  const patient = await this.patientRepository.findOne({
    where: { id: createDto.patientId },
  });

  if (patient) {
    // You can now access patient.firstName, patient.lastName, patient.phone, etc.
    Logger.log(`Patient details: Name: ${patient.firstName} ${patient.lastName}, Phone: ${patient.phone}`);
    await this.sendReminder(patient);
  }

  return savedAppointment;
}

  async findAll(
    filterDto: AppointmentFilterDto,
    userId: string,
  ): Promise<Appointment[]> {
    const { startDate, endDate, ...filters } = filterDto;
    const where: any = { userId };

    if (filters.patientName) {
      where.patient = { name: Like(`%${filters.patientName}%`) };
    }
    if (filters.facilityId) where.facilityId = filters.facilityId;
    if (filters.doctorId) where.doctorId = filters.doctorId;
    if (filters.status) where.status = filters.status;
    if (filters.channel) where.channel = filters.channel;
    if (filters.language) where.language = filters.language;
    if (filters.riskLevel) where.riskLevel = filters.riskLevel;

    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    } else if (startDate) {
      where.date = Between(startDate, new Date());
    }

    return this.appointmentRepository.find({
      where,
      relations: ['patient', 'facility', 'doctor'],
      order: { date: 'ASC' },
    });
  }

  async findOne(id: number, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id, userId },
      relations: ['patient', 'facility', 'doctor'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(
    id: number,
    updateDto: UpdateAppointmentDto,
    userId: string,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id, userId);

    // Add to history if status changed
    if (updateDto.status && updateDto.status !== appointment.status) {
      appointment.history.push({
        event: `STATUS_CHANGED: ${updateDto.status}`,
        timestamp: new Date(),
        details: { by: userId },
      });
    }

    Object.assign(appointment, updateDto);
    return this.appointmentRepository.save(appointment);
  }

  async updateStatus(
    id: number,
    status: AppointmentStatus,
    userId: string,
  ): Promise<Appointment> {
    return this.update(id, { status }, userId);
  }

  async calculateRisk(id: number, userId: string): Promise<Appointment> {
    const appointment = await this.findOne(id, userId);
    
    // In a real implementation, this would call an ML service
    const noShowProbability = Math.random();
    let riskLevel: RiskLevel;
    
    if (noShowProbability > 0.7) riskLevel = RiskLevel.HIGH;
    else if (noShowProbability > 0.4) riskLevel = RiskLevel.MEDIUM;
    else riskLevel = RiskLevel.LOW;
    
    appointment.noShowProbability = noShowProbability;
    appointment.riskLevel = riskLevel;
    
    appointment.history.push({
      event: 'RISK_ASSESSED',
      timestamp: new Date(),
      details: { riskLevel, probability: noShowProbability },
    });
    
    return this.appointmentRepository.save(appointment);
  }

  private generateDefaultReminders(
    date: Date,
    channel: string,
  ): { time: Date; channel: string; sent: boolean }[] {
    const reminders: { time: Date; channel: string; sent: boolean }[] = [];
    const appointmentDate = new Date(date);
    
    // 24 hours before
    const reminder24h = new Date(appointmentDate);
    reminder24h.setHours(reminder24h.getHours() - 24);
    reminders.push({
      time: reminder24h,
      channel,
      sent: false,
    });
    
    // 2 hours before
    const reminder2h = new Date(appointmentDate);
    reminder2h.setHours(reminder2h.getHours() - 2);
    reminders.push({
      time: reminder2h,
      channel,
      sent: false,
    });
    
    return reminders;
  }

  // Sends a reminder to the patient using the ArkeselService
  private async sendReminder(patient: Patient): Promise<void> {
    if (!patient.phone) {
      Logger.warn('Patient phone number is missing, cannot send reminder.');
      return;
    }
    const message = `Dear ${patient.firstName}, this is a reminder for your upcoming appointment.`;
    try {
      await this.arkasel.sendSms(patient.phone, message);
      Logger.log(`Reminder sent to ${patient.phone}`);
    } catch (error) {
      Logger.error(`Failed to send reminder to ${patient.phone}: ${error.message}`);
    }
  }
}