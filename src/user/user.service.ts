import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { S3Service } from 'src/common/s3/s3.service';
import { USER_IMAGE_FILE_EXTENSION, USER_PROFILE_IMAGE_BUCKET } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service
  ) {}
  async create(createUserInput: CreateUserInput) {
    try {
      const userExist = await this.userRepository.findOne({ email: createUserInput.email })
      if(userExist) {
        throw new BadRequestException('User already exists!')
      }

      const user = await this.userRepository.create({
        ...createUserInput,
        password: await this.hashPassword(createUserInput.password)
      })
      return user
    } catch(err) {
      throw err
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  async findAll() {
    return await this.userRepository.find({})
  }

  async uploadProfileImage(file: Buffer, userId: number) {
    try {
      const user = await this.findOne(userId)
      const bucket = USER_PROFILE_IMAGE_BUCKET, key = this.getUserS3Key(userId)
      await this.s3Service.upload({
        bucket,
        key,
        file
      })
      const profileUrl = this.s3Service.getFileUrl(bucket, key)
      await this.userRepository.findOneAndUpdate({ id: user.id }, { imageUrl: profileUrl })
      return true
    } catch(err) {
      throw new InternalServerErrorException('Unable to upload user profile')
    }
  }

  async findOne(id: number):Promise<User> {
    const user = await this.userRepository.findOne({ id })
    if(!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async update(id: number, updateUserInput: UpdateUserInput):Promise<User> {
    const user = await this.userRepository.findOneAndUpdate({id}, {
      ...updateUserInput
    })
    return user
  }

  async remove(id: number) {
    await this.userRepository.fineOneAndDelete({ id })
    return true
  }

  async verfiyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email })
    if(!user) {
      throw new NotFoundException('User not found')
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword) {
      throw new UnauthorizedException('Unauthorized')
    }
    return user
  }

  getUserS3Key(userId: number) {
    return `${userId}.${USER_IMAGE_FILE_EXTENSION}`
  }
}
