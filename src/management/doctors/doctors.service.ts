import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctors.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FacilitiesService } from '../facilities/facilities.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private facilitiesService: FacilitiesService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto, user: User): Promise<Doctor> {
    const facility = await this.facilitiesService.findOne(createDoctorDto.facilityId);
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      facility,
      user, // link doctor to user
    });
    return this.doctorRepository.save(doctor);
  }

  async findAll(user: User): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { user: { id: user.id } },
      relations: ['facility'],
    });
  }

  async findOne(id: number, user: User): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['facility'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto, user: User): Promise<Doctor> {
    const doctor = await this.findOne(id, user);

    if (updateDoctorDto.facilityId) {
      const facility = await this.facilitiesService.findOne(updateDoctorDto.facilityId);
      doctor.facility = facility;
    }

    Object.assign(doctor, updateDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async remove(id: number, user: User): Promise<void> {
    const doctor = await this.findOne(id, user);
    const result = await this.doctorRepository.delete(doctor.id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
  }

  async generateDemo(user: User): Promise<Doctor[]> {
    // Get existing facilities for this user
    const facilities = await this.facilitiesService.findAll(user);
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

      const doctor = await this.create(doctorData, user);
      demoDoctors.push(doctor);
    }

    return demoDoctors;
  }
}