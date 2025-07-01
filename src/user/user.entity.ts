import { Doctor } from 'src/management/doctors/doctors.entity';
import { Facility } from 'src/management/facilities/facilities.entity';
import { Patient } from 'src/management/patients/patients.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clerkUserId: string;

  @Column({ unique: true, nullable: true })
  stripeCustomerId: string;

  @Column()
  role: string; // 'admin', 'doctor', 'clerk', 'manager'

  @Column({ nullable: true })
  facilityId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'text', default: 'free' })
  currentPlan: string

  @Column()
  phone: string;

  @OneToMany(() => Facility, facility => facility.user)
  facilities: Facility[];

  @OneToMany(() => Doctor, doctor => doctor.user)
  doctors: Doctor[];

  @OneToMany(() => Patient, patient => patient.user)
  patients: Patient[];
}