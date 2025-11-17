import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AbstractRepository } from "src/common/database/abstract.repository";
import { Message } from "./entities/message.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessageRepository extends AbstractRepository<Message> {
  protected readonly logger = new Logger(MessageRepository.name)
  constructor(
    @InjectRepository(Message)
    messageRepository: Repository<Message>
  ) {
    super(messageRepository)
  }
}