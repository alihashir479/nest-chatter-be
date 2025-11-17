import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { UseGuards } from '@nestjs/common';
import { gqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/CurrentUser.decorator';
import { type TokenPayload } from 'src/auth/token-payload.interface';
import { ChatResponseDto } from './dto/chat-response.dto';
import { PaginationArgs } from 'src/common/database/pagination/pagination.args';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}
  
  @UseGuards(gqlAuthGuard)
  @Mutation(() => Chat)
  createChat(@Args('createChatInput') createChatInput: CreateChatInput, @CurrentUser() user: TokenPayload) {
    return this.chatsService.create(createChatInput, user.id);
  }

  @UseGuards(gqlAuthGuard)
  @Query(() => [ChatResponseDto], { name: 'chats' })
  async findAll(@Args() paginationArgs: PaginationArgs, @CurrentUser() user: TokenPayload):Promise<ChatResponseDto[]> {
    const chats = await this.chatsService.findAll(paginationArgs, user.id);
    return chats
  }

  @UseGuards(gqlAuthGuard)
  @Query(() => ChatResponseDto, { name: 'chat' })
  findOne(@Args('id') id: string) {
    return this.chatsService.findOne(+id);
  }
}
