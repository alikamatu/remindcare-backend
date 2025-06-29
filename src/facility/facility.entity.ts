import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Facility {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    tier: 'basic' | 'premium' | 'enterprise';
    patientCap: number;
  };
}