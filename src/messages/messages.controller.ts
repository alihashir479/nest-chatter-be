import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { gqlAuthGuard } from "src/auth/guards/gql-auth.guard";
import { MessagesService } from "./messages.service";

@Controller('api/messages')
@UseGuards(gqlAuthGuard)
export class MessageController {
  constructor(
    private readonly messageService: MessagesService
  ) {}

  @Get('count')
  async getMessagesCount(@Query('chatId') chatId: string) {
    return await this.messageService.getChatTotalMessagesCount(+chatId)
  }
}