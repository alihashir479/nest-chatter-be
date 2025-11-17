import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './CurrentUser.decorator';
import { User } from 'src/user/entities/user.entity';
import { type Response } from 'express';
import { LocalAuthGuard } from './guards/local.guard';
import { gqlAuthGuard } from './guards/gql-auth.guard';
import { S3Service } from 'src/common/s3/s3.service';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res() res: Response
  ) {
    await this.authService.login(user, res)
  }

  
  @Post('/logout')
  @UseGuards(gqlAuthGuard)
  logout(
    @Res() response: Response
  ) {
    response.cookie('authentication', '', {
      httpOnly: true,
      expires: new Date()
    })
    return response.status(200).json({ message: 'Logged out successfully' });
  }
}