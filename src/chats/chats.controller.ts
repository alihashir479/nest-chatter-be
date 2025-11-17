import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/CurrentUser.decorator";
import { gqlAuthGuard } from "src/auth/guards/gql-auth.guard";
import { type TokenPayload } from "src/auth/token-payload.interface";
import { ChatsService } from "./chats.service";

@Controller('api/chats')
@UseGuards(gqlAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatsService
  ) {}
  @Get('count')
  async chatCount(@CurrentUser() user: TokenPayload) {
    const total = await this.chatService.countCurrentUserChats(user.id)
    return total
  }
}