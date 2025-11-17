import { Field, ObjectType } from "@nestjs/graphql";
import { Exclude, Expose, Type } from "class-transformer";
import { MessageResponseDto } from "src/messages/dto/message-response.dto";

@Exclude()
@ObjectType()
export class ChatResponseDto {
  @Field()
  @Expose()
  id: number

  @Field()
  @Expose()
  name: string

  @Field()
  @Expose()
  userId: number

  @Field(() => MessageResponseDto, { nullable: true })
  @Expose()
  @Type(() => MessageResponseDto)
  latestMessage?: MessageResponseDto
}