import { Module } from '@nestjs/common';
import { FacilitiesModule } from './facilities/facilities.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [FacilitiesModule, DoctorsModule, PatientsModule],
  exports: [FacilitiesModule, DoctorsModule, PatientsModule]
})
export class ManagementModule {}