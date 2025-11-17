import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  content: string

  @Field()
  @IsNotEmpty()
  @IsInt()
  chatId: number
}
