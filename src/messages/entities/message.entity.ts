import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Chat } from '../../chats/entities/chat.entity'
import { AbstractEntity } from '../../common/database/abstract.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity({ name: 'messages' })
export class Message extends AbstractEntity {
  @Field()
  @Column({ type: 'text' })
  content: string

  @Field()
  @ManyToOne(() => User)
  @JoinColumn()
  user: User

  @Field(() => Chat)
  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat

  @Field()
  @Column()
  chatId: number
}
