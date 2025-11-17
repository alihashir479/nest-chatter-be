import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "./user.service";
import { CurrentUser } from "src/auth/CurrentUser.decorator";
import { type TokenPayload } from "src/auth/token-payload.interface";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";

@Controller('api/user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe(
        {
          validators: [
            new MaxFileSizeValidator({ maxSize: 100000 }),
            new FileTypeValidator({ fileType: 'image/jpeg'})
          ]
        }
    )
    ) file: Express.Multer.File,
    @CurrentUser() user: TokenPayload
  ) {
    return this.userService.uploadProfileImage(file.buffer, user.id)
  }
}