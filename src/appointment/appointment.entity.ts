import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppointmentStatus, AppointmentChannel } from '../shared/constants/appointment.constants';
import { Patient } from 'src/shared/entities/patient.entity';
import { Facility } from 'src/shared/entities/facility.entity';
import { Doctor } from 'src/shared/entities/doctor.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn()
  patient: Patient;

  @ManyToOne(() => Facility, { eager: true })
  @JoinColumn()
  facility: Facility;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn()
  doctor: Doctor;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    enum: AppointmentChannel,
  })
  channel: AppointmentChannel;

  @Column({ default: 'en' })
  language: string;

  @Column({ type: 'jsonb', nullable: true })
  reminders: { time: Date; channel: string; sent: boolean }[];

  @Column({ type: 'jsonb', nullable: true })
  history: { event: string; timestamp: Date; details: any }[];

  @Column({ nullable: true })
  riskLevel: string;

  @Column({ nullable: true })
  noShowProbability: number;

  @Column()
  userId: string; // Clerk user ID
}