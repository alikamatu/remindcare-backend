import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClerkService } from '../clerk/clerk.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, ClerkService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}