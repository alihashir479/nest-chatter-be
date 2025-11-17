import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { S3Module } from 'src/common/s3/s3.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    S3Module
  ],
  controllers: [UserController],
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserService, UserRepository]
})
export class UserModule {}
