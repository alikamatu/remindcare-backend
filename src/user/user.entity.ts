import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clerkUserId: string;

  @Column()
  role: string; // 'admin', 'doctor', 'clerk', 'manager'

  @Column({ nullable: true })
  facilityId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;
}