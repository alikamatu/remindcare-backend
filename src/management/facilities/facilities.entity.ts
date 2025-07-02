import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Doctor } from '../doctors/doctors.entity';
import { Patient } from '../patients/patients.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Facility extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  capacity: number;

  @Column({ type: 'jsonb', nullable: true })
  operatingHours: Record<string, { open: string; close: string }>;

  @OneToMany(() => Doctor, doctor => doctor.facility)
  doctors: Doctor[];

  @OneToMany(() => Patient, patient => patient.facility)
  patients: Patient[];

  @ManyToOne(() => User, user => user.facilities)
  user: User;
}