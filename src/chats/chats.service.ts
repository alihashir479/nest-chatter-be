import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatRepository } from './chats.repository';
import { plainToInstance } from 'class-transformer';
import { ChatResponseDto } from './dto/chat-response.dto';
import { PaginationArgs } from 'src/common/database/pagination/pagination.args';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatRepository: ChatRepository
  ) {}
  async create(createChatInput: CreateChatInput, userId: number) {
    const chat = await this.chatRepository.create({
      ...createChatInput, 
      userIds: createChatInput.userIds || [],
      userId,
      messages: []
    })
    return chat
  }

  async findAll(paginationArgs: PaginationArgs, userId: number): Promise<ChatResponseDto[]> {
    const chats =
      await this.chatRepository
      .getQueryBuilder('chat')
      .where('chat.userId = :userId', { userId })
      .orWhere(':userId = ANY(chat.userIds)', { userId })
      .leftJoinAndSelect(
        'chat.messages',
        'message',
        'message.id = (SELECT id from messages m WHERE m."chatId" = chat.id ORDER BY m.created_at DESC LIMIT 1)'
      )
      .leftJoinAndSelect('message.user', 'user')
      .skip(paginationArgs.offset)
      .take(paginationArgs.limit)
      .getMany()

      chats.forEach((chat) => {
        chat.latestMessage = chat.messages.length > 0 ? chat.messages[0] : undefined
      })

      return plainToInstance(ChatResponseDto, chats)
  }

  async findOne(chatId: number) {
    const chat = await 
      this.chatRepository
      .getQueryBuilder('chat')
      .where('chat.id = :chatId', { chatId })
      .leftJoinAndSelect(
        'chat.messages',
        'message',
        'message.id = (SELECT m.id FROM messages m WHERE m."chatId" = chat.id ORDER BY m.created_at DESC LIMIT 1)'
      )
      .leftJoinAndSelect('message.user', 'user')
      .getOne()

    if(chat && chat.messages.length > 0) {
      chat.latestMessage = chat.messages[0]
    }
    
    const response = plainToInstance(ChatResponseDto, chat)

    return response
  }

  async countCurrentUserChats(userId: number) {
    const totalChats = await this.chatRepository
      .getQueryBuilder('chat')
      .where('chat.userId = :userId', { userId })
      .orWhere(':userId = ANY(chat.userIds)')
      .getCount()

    return totalChats
  }
}
