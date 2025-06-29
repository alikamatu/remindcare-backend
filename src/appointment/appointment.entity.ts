import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Facility } from '../facility/facility.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.id)
  patient: string;

  @ManyToOne(() => Facility, facility => facility.id)
  facility: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ 
    type: 'enum', 
    enum: ['scheduled', 'confirmed', 'cancelled', 'no-show'] 
  })
  status: string;

  @Column()
  channel: string; // 'sms', 'ivr', 'whatsapp'

  @Column()
  language: string;
}