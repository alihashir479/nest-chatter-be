import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateChatInput {

  @Field()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isPrivate: boolean

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  userIds?: number[]

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string
}
