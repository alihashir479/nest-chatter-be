import { Field, ObjectType } from "@nestjs/graphql";
import { Exclude, Expose, Type } from "class-transformer";
import { UserResponseDto } from "src/user/dto/user-response.dto";

@Exclude()
@ObjectType()
export class MessageResponseDto {
  @Field()
  @Expose()
  id: number

  @Field()
  @Expose()
  content: string

  @Field()
  @Expose()
  chatId: number

  @Field()
  @Expose()
  createdAt: Date

  @Field(() => UserResponseDto)
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto
}
