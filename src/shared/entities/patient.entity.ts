import { Appointment } from 'src/appointment/appointment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ type: 'jsonb', nullable: true })
  medicalHistory: {
    allergies: string[];
    conditions: string[];
    medications: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @Column({ default: 0 })
  noShowCount: number;
}