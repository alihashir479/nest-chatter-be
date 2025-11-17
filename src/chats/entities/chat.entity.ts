import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AbstractEntity } from '../../common/database/abstract.entity'
import { Column, Entity, OneToMany } from 'typeorm';
import { Message } from '../../messages/entities/message.entity'

@ObjectType()
@Entity({ name: 'chats' })
export class Chat extends AbstractEntity {
  @Field()
  @Column()
  userId: number

  @Field()
  @Column()
  isPrivate: boolean

  @Field(() => [Int])
  @Column('int', { array: true })
  userIds: number[]

  
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string
  
  @Field(() => Message)
  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[]

  latestMessage?: Message
}
