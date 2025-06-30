import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ClerkService } from '../clerk/clerk.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private clerkService: ClerkService
  ) {}

  async createOrUpdateFromClerk(clerkUserId: string, data: Partial<User>) {
    let user = await this.userRepository.findOne({ where: { clerkUserId } });
    
    if (!user) {
      user = this.userRepository.create({ clerkUserId, ...data });
    } else {
      this.userRepository.merge(user, data);
    }
    
    // Update Clerk metadata
    await this.clerkService.updateUserMetadata(clerkUserId, {
      role: data.role,
      facilityId: data.facilityId
    });

    return this.userRepository.save(user);
  }

  async findByClerkId(clerkUserId: string) {
    return this.userRepository.findOne({ where: { clerkUserId } });
  }

    async updateUserPlan(id: string, plan: string) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) return this.userRepository.save({ id, currentPlan: plan, email: '', createdAt: new Date() })
    user.currentPlan = plan
    return this.userRepository.save(user)
  }
}