import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctors.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FacilitiesService } from '../facilities/facilities.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private facilitiesService: FacilitiesService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto, clerkUserId: string): Promise<Doctor> {
    // Only allow creating a doctor for a facility owned by the current user
    const facility = await this.facilitiesService.findOne(createDoctorDto.facilityId);
    if (!facility || facility.user.clerkUserId !== clerkUserId) {
      throw new NotFoundException('Facility not found or not owned by user');
    }
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      facility,
    });
    return this.doctorRepository.save(doctor);
  }

  async findAll(clerkUserId: string): Promise<Doctor[]> {
    // Only return doctors for facilities owned by the current user
    return this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.facility', 'facility')
      .leftJoinAndSelect('facility.user', 'user')
      .where('user.clerkUserId = :clerkUserId', { clerkUserId })
      .getMany();
  }

  async findOne(id: number, clerkUserId: string): Promise<Doctor> {
    if (!id || isNaN(Number(id))) {
      throw new NotFoundException('Invalid doctor ID');
    }
    // Only return the doctor if it belongs to a facility owned by the current user
    const doctor = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.facility', 'facility')
      .leftJoinAndSelect('facility.user', 'user')
      .where('doctor.id = :id', { id })
      .andWhere('user.clerkUserId = :clerkUserId', { clerkUserId })
      .getOne();
  
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found for this user`);
    }
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto, clerkUserId: string): Promise<Doctor> {
    const doctor = await this.findOne(id, clerkUserId);

    if (updateDoctorDto.facilityId) {
      const facility = await this.facilitiesService.findOne(updateDoctorDto.facilityId);
      if (!facility || facility.user.clerkUserId !== clerkUserId) {
        throw new NotFoundException('Facility not found or not owned by user');
      }
      doctor.facility = facility;
    }

    Object.assign(doctor, updateDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async remove(id: number, clerkUserId: string): Promise<void> {
    const doctor = await this.findOne(id, clerkUserId);
    const result = await this.doctorRepository.delete(doctor.id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
  }

  async generateDemo(clerkUserId: string): Promise<Doctor[]> {
    // Get existing facilities for this user
    const facilities = await this.facilitiesService.findAll(clerkUserId);
    if (facilities.length === 0) {
      throw new NotFoundException('No facilities found. Create facilities first.');
    }

    const specialties = [
      'Cardiology', 'Dermatology', 'Endocrinology',
      'Gastroenterology', 'Neurology', 'Oncology'
    ];

    const demoDoctors: Doctor[] = [];

    for (let i = 1; i <= 5; i++) {
      const firstName = `Doctor${i}`;
      const lastName = `Demo${i}`;
      const specialty = specialties[Math.floor(Math.random() * specialties.length)];

      const doctorData: CreateDoctorDto = {
        firstName,
        lastName,
        specialty,
        licenseNumber: `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
        phone: `+1617555${Math.floor(1000 + Math.random() * 9000)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@demo.synchora.com`,
        facilityId: facilities[Math.floor(Math.random() * facilities.length)].id,
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        }
      };

      const doctor = await this.create(doctorData, clerkUserId);
      demoDoctors.push(doctor);
    }

    return demoDoctors;
  }
}