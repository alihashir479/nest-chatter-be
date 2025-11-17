import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty } from "class-validator";
import { PaginationArgs } from "src/common/database/pagination/pagination.args";

@ArgsType()
export class getMessagesArgs extends PaginationArgs {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  chatId: number
}