import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty } from "class-validator";

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  offset: number

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  limit: number
}