import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facility } from './facilities.entity';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(Facility)
    private facilityRepository: Repository<Facility>,
  ) {}

  async create(createFacilityDto: CreateFacilityDto, user: User): Promise<Facility> {
    const facility = this.facilityRepository.create({
      ...createFacilityDto,
      user, // associate facility with the user
    });
    return this.facilityRepository.save(facility);
  }

  async findAll(user: User): Promise<Facility[]> {
    return this.facilityRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: number): Promise<Facility> {
    const facility = await this.facilityRepository.findOne({ where: { id } });
    if (!facility) {
      throw new NotFoundException(`Facility with ID ${id} not found`);
    }
    return facility;
  }

  async update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<Facility> {
    const facility = await this.findOne(id);
    Object.assign(facility, updateFacilityDto);
    return this.facilityRepository.save(facility);
  }

  async remove(id: number): Promise<void> {
    const result = await this.facilityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Facility with ID ${id} not found`);
    }
  }

  async generateDemo(): Promise<Facility[]> {
    const demoFacilities = [
      {
        name: 'Synchora Main Hospital',
        address: '123 Health Avenue',
        city: 'Medford',
        state: 'MA',
        zipCode: '02155',
        phone: '+16175551234',
        email: 'main@synchora.com',
        capacity: 500,
        operatingHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '16:00' },
          sunday: { open: '10:00', close: '14:00' },
        }
      },
      {
        name: 'Synchora Downtown Clinic',
        address: '456 Wellness Street',
        city: 'Boston',
        state: 'MA',
        zipCode: '02108',
        phone: '+16175556789',
        email: 'downtown@synchora.com',
        capacity: 200,
        operatingHours: {
          monday: { open: '07:00', close: '19:00' },
          tuesday: { open: '07:00', close: '19:00' },
          wednesday: { open: '07:00', close: '19:00' },
          thursday: { open: '07:00', close: '19:00' },
          friday: { open: '07:00', close: '17:00' },
        }
      }
    ];

    const createdFacilities: Facility[] = [];
    for (const facilityData of demoFacilities) {
      const facility = this.facilityRepository.create(facilityData);
      createdFacilities.push(await this.facilityRepository.save(facility));
    }
    
    return createdFacilities;
  }
}