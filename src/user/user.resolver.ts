import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Post, Res, UseGuards } from '@nestjs/common';
import { gqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/CurrentUser.decorator';
import { type TokenPayload } from 'src/auth/token-payload.interface';
import { type Response } from 'express';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(gqlAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(gqlAuthGuard)
  findOne(@CurrentUser() user: TokenPayload) {
    return this.userService.findOne(user.id);
  }

  @Mutation(() => User)
  @UseGuards(gqlAuthGuard)
  async updateUser(
    @CurrentUser() user: TokenPayload,
    @Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const updatedUser = await this.userService.update(user.id, updateUserInput)
    return updatedUser
  }

  @Mutation(() => User)
  @UseGuards(gqlAuthGuard)
  removeUser(@CurrentUser() user: TokenPayload) {
    return this.userService.remove(user.id);
  }

  @Query(() => User, { name: 'getMe'})
  @UseGuards(gqlAuthGuard)
  getMe(@CurrentUser() user: TokenPayload) {
    return user
  }
}
