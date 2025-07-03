import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Appointment } from './appointment.entity'
import { AppointmentsService } from './appointments.service'
import { AppointmentsController } from './appointments.controller'
import { ArkeselService } from 'src/arkasel/arkesel.service'
import { Patient } from 'src/management/patients/patients.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Patient])],
  providers: [AppointmentsService, ArkeselService],
  controllers: [AppointmentsController],
})
export class AppointmentModule {}
