import { Field, ObjectType } from "@nestjs/graphql";
import { Exclude, Expose } from "class-transformer";

@Exclude()
@ObjectType()
export class UserResponseDto {
  @Field()
  @Expose()
  id: number

  @Field()
  @Expose()
  email: string

  @Field({ nullable: true })
  @Expose()
  imageUrl?: string

  @Field()
  @Expose()
  username: string
}