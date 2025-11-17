import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { MessageRepository } from './messages.repository';
import { ChatRepository } from 'src/chats/chats.repository';
import { PUB_SUB } from 'src/common/pubsub/constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGED_CREATED } from './constants/constants';
import { UserRepository } from 'src/user/user.repository';
import { MessageResponseDto } from './dto/message-response.dto';
import { plainToInstance } from 'class-transformer';
import { getMessagesArgs } from './dto/get-messages.args';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}
  async create(createMessageInput: CreateMessageInput, userId: number):Promise<MessageResponseDto> {
    const { chatId, content } = createMessageInput
    const chat = await this.chatRepository.findOne({ id: chatId })

    if(!chat) {
      throw new HttpException('Invalid chat Id', HttpStatus.BAD_REQUEST)
    }

    if(chat.userId !== userId && !chat.userIds.includes(userId)) {
      throw new HttpException('Cannot send message to this chat', HttpStatus.FORBIDDEN)
    }

    const user = await this.userRepository.findOne({ id: userId })

    if(!user) {
      throw new UnauthorizedException('Unauthorized')
    }

    const newMessage = await this.messageRepository.create({
      chatId,
      user,
      content,
      chat
    })

    this.pubSub.publish(MESSAGED_CREATED, { messageCreated: newMessage })

    return plainToInstance(MessageResponseDto, newMessage)
  }

  async findAll(messagesArgs: getMessagesArgs):Promise<MessageResponseDto[]> {
    const chatId = messagesArgs.chatId
    const limit = messagesArgs.limit || 0
    const offset = messagesArgs.offset || 0
    const messages = await this.messageRepository
      .getQueryBuilder('message')
      .where('message.chatId = :chatId', { chatId })
      .leftJoinAndSelect(
        "message.user", "user"
      )
      .orderBy('message.created_at', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany()

    return plainToInstance(MessageResponseDto, messages)
  }

  async getChatTotalMessagesCount(chatId: number) {
    const totalMessages = await this.messageRepository
      .getQueryBuilder('messages')
      .where('messages.chatId = :chatId', { chatId })
      .getCount()

    return totalMessages
  }
}
