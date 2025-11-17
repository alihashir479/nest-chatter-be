import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Inject, UseGuards } from '@nestjs/common';
import { gqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/CurrentUser.decorator';
import { type TokenPayload } from 'src/auth/token-payload.interface';
import { getMessagesArgs } from './dto/get-messages.args';
import { PUB_SUB } from 'src/common/pubsub/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MessageCreatedArgs } from './dto/message-created.args';
import { MESSAGED_CREATED } from './constants/constants';
import { MessageResponseDto } from './dto/message-response.dto';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  @Mutation(() => MessageResponseDto)
  @UseGuards(gqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput, 
    @CurrentUser() user: TokenPayload
  ) {
    return await this.messagesService.create(createMessageInput, user.id);
  }

  @UseGuards(gqlAuthGuard)
  @Query(() => [MessageResponseDto], { name: 'messages' })
  async findAll(@Args() messagesArgs: getMessagesArgs) {
    return await this.messagesService.findAll(messagesArgs);
  }

  @Subscription(() => MessageResponseDto, {
    filter: (payload, variables: MessageCreatedArgs, context) => {
      const user = context.req.user
      const userId = user.id
      return variables.chatIds.includes(payload.messageCreated.chatId) && payload.messageCreated.user.id !== userId
    }
  })
  messageCreated(@Args() messageCreatedArgs: MessageCreatedArgs) {
    return this.pubSub.asyncIterableIterator(MESSAGED_CREATED)
  }
}
