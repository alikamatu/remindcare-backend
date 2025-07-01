import { BaseEntity } from 'src/shared/entities/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Facility } from '../facilities/facilities.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Patient extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column() 
  userId: string

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

  @Column()
  language: string;

  @ManyToOne(() => Facility, facility => facility.patients)
  @JoinColumn()
  facility: Facility;

  @Column()
  facilityId: number;

  @Column({ default: 0 })
  noShowCount: number;

  @ManyToOne(() => User, user => user.patients)
  user: User;
}