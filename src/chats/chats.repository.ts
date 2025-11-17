import { AbstractRepository } from "src/common/database/abstract.repository";
import { Chat } from "./entities/chat.entity";
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class ChatRepository extends AbstractRepository<Chat> {
  protected readonly logger = new Logger(ChatRepository.name)
  constructor(
    @InjectRepository(Chat)
    chatRepository: Repository<Chat>
  ) {
    super(chatRepository)
  }
}