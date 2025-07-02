import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../patients/patients.entity';
import { CreatePatientDto } from '../patients/dto/create-patient.dto';
import { UpdatePatientDto } from '../patients/dto/update-patient.dto';
import { FacilitiesService } from '../facilities/facilities.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private facilitiesService: FacilitiesService,
  ) {}

  async create(createPatientDto: CreatePatientDto, clerkUserId: string): Promise<Patient> {
    // Only allow creating a patient for a facility owned by the current user
    const facility = await this.facilitiesService.findOne(createPatientDto.facilityId);
    if (!facility || facility.user.clerkUserId !== clerkUserId) {
      throw new NotFoundException('Facility not found or not owned by user');
    }
    const patient = this.patientRepository.create({
      ...createPatientDto,
      facility,
      userId: facility.user.id, // or set user: facility.user if you have a relation
    });
    return this.patientRepository.save(patient);
  }

  async findAll(clerkUserId: string): Promise<Patient[]> {
    // Only return patients for facilities owned by the current user
    return this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.facility', 'facility')
      .leftJoinAndSelect('facility.user', 'user')
      .where('user.clerkUserId = :clerkUserId', { clerkUserId })
      .getMany();
  }

  async findOne(id: number, clerkUserId: string): Promise<Patient> {
    // Only return the patient if it belongs to a facility owned by the current user
    const patient = await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.facility', 'facility')
      .leftJoinAndSelect('facility.user', 'user')
      .where('patient.id = :id', { id })
      .andWhere('user.clerkUserId = :clerkUserId', { clerkUserId })
      .getOne();

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found for this user`);
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto, clerkUserId: string): Promise<Patient> {
    const patient = await this.findOne(id, clerkUserId);

    if (updatePatientDto.facilityId) {
      const facility = await this.facilitiesService.findOne(updatePatientDto.facilityId);
      if (!facility || facility.user.clerkUserId !== clerkUserId) {
        throw new NotFoundException('Facility not found or not owned by user');
      }
      patient.facility = facility;
    }

    Object.assign(patient, updatePatientDto);
    return this.patientRepository.save(patient);
  }

  async remove(id: number, clerkUserId: string): Promise<void> {
    const patient = await this.findOne(id, clerkUserId);
    const result = await this.patientRepository.delete(patient.id);
    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async generateDemo(clerkUserId: string): Promise<Patient[]> {
    // Get existing facilities for this user
    const facilities = await this.facilitiesService.findAll(clerkUserId);
    if (facilities.length === 0) {
      throw new NotFoundException('No facilities found. Create facilities first.');
    }

    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    const languages = ['English', 'Spanish', 'French', 'Mandarin', 'Arabic'];

    const demoPatients: Patient[] = [];

    for (let i = 1; i <= 10; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const language = languages[Math.floor(Math.random() * languages.length)];

      // Generate random birth date between 18 and 80 years ago
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - Math.floor(18 + Math.random() * 62));

      const facility = facilities[Math.floor(Math.random() * facilities.length)];

      const patientData = {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@demo.synchora.com`,
        phone: `+1617555${Math.floor(1000 + Math.random() * 9000)}`,
        dateOfBirth: birthDate,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        language,
        facilityId: facility.id,
        medicalHistory: {
          allergies: ['Penicillin', 'Pollen'],
          conditions: ['Hypertension', 'Type 2 Diabetes'],
          medications: ['Lisinopril', 'Metformin']
        },
        insurance: {
          provider: 'Demo Insurance Co.',
          policyNumber: `POL-${Math.floor(10000 + Math.random() * 90000)}`,
          groupNumber: `GRP-${Math.floor(1000 + Math.random() * 9000)}`
        }
      };

      const patient = await this.create(patientData, clerkUserId);
      demoPatients.push(patient);
    }

    return demoPatients;
  }
}