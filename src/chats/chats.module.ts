import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatRepository } from './chats.repository';
import { ChatController } from './chats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Chat ])
  ],
  controllers: [ChatController],
  providers: [ChatsResolver, ChatsService, ChatRepository],
  exports: [ChatRepository]
})
export class ChatsModule {}
