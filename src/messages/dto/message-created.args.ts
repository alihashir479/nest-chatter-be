import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsArray, IsInt, IsNotEmpty } from "class-validator";

@ArgsType()
export class MessageCreatedArgs {
  @Field(() => [Int])
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsInt({ each: true })
  chatIds: number[]
}