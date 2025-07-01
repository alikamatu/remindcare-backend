import { BaseEntity } from 'src/shared/entities/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Facility } from '../facilities/facilities.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Doctor extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  specialty: string;

  @Column()
  licenseNumber: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'jsonb', nullable: true })
  availability: Record<string, boolean>;

  @ManyToOne(() => Facility, facility => facility.doctors)
  @JoinColumn()
  facility: Facility;

  @Column()
  facilityId: number;

  @ManyToOne(() => User, user => user.doctors)
  user: User;
}