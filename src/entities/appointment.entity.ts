import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patient_id: string;

  @Column({ type: 'timestamptz' })
  scheduled_at: Date;

  @Column({ default: 'scheduled' })
  status: string;
}