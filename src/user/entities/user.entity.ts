import { ObjectType, Field } from '@nestjs/graphql';
import { AbstractEntity } from '../../common/database/abstract.entity'
import { Column, Entity, OneToOne } from 'typeorm';

@ObjectType()
@Entity({name: 'users'})
export class User extends AbstractEntity {
  @Field()
  @Column({ type: 'varchar', length: 255})
  email: string

  @Field()
  @Column({ type: 'varchar', length: 100 })
  username: string

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string

  @Field()
  @Column()
  password: string
}
