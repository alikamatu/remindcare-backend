import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ClerkGuard } from 'src/clerk/clerk.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(ClerkGuard)
  async getMe(@Req() req) {
    return this.userService.findByClerkId(req.user.clerkUserId);
  }

  @Post()
  async createUser(@Body() userData: Partial<User>) {
    if (!userData.clerkUserId) {
      throw new Error('clerkUserId is required');
    }
    return this.userService.createOrUpdateFromClerk(userData.clerkUserId, userData);
  }
}