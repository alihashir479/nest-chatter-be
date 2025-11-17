import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { MessageRepository } from './messages.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatsModule } from 'src/chats/chats.module';
import { UserModule } from 'src/user/user.module';
import { MessageController } from './messages.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ChatsModule,
    UserModule
  ],
  controllers: [MessageController],
  providers: [MessagesResolver, MessagesService, MessageRepository],
})
export class MessagesModule {}
