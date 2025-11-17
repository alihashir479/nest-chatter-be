import { AbstractRepository } from "src/common/database/abstract.repository";
import { User } from "./entities/user.entity";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  readonly logger = new Logger(UserRepository.name)
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>
  ) {
    super(userRepository)
  }
}