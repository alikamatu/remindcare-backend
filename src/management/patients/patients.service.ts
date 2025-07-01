import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patients.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FacilitiesService } from '../facilities/facilities.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private facilitiesService: FacilitiesService,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const facility = await this.facilitiesService.findOne(createPatientDto.facilityId);
    const patient = this.patientRepository.create({
      ...createPatientDto,
      facility
    });
    return this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({ relations: ['facility'] });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ 
      where: { id },
      relations: ['facility']
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    
    if (updatePatientDto.facilityId) {
      const facility = await this.facilitiesService.findOne(updatePatientDto.facilityId);
      patient.facility = facility;
    }
    
    Object.assign(patient, updatePatientDto);
    return this.patientRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    const result = await this.patientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async generateDemo(user: any): Promise<Patient[]> {
    // Get existing facilities
    const facilities = await this.facilitiesService.findAll(user);
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
      
      const patientData = {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@demo.synchora.com`,
        phone: `+1617555${Math.floor(1000 + Math.random() * 9000)}`,
        dateOfBirth: birthDate,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        language,
        facilityId: facilities[Math.floor(Math.random() * facilities.length)].id,
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
      
      const patient = await this.create(patientData);
      demoPatients.push(patient);
    }
    
    return demoPatients;
  }
}