import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { type TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async login(
    user: User,
    res: Response
  ) {

    const expirationInSeconds = this.configService.getOrThrow('JWT_EXPIRATION')
    const expires = new Date(Date.now() + (expirationInSeconds * 1000))

    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      imageUrl: user.imageUrl || null
    }

    const token = this.jwtService.sign(tokenPayload)
    res.cookie('authentication', token, {
      httpOnly: true,
      expires
    })

    res.status(200).json({ data: user, message: 'success' })
  }

  verifyWs(request: Request): TokenPayload {
    try {
      const cookies: string[] | undefined = request.headers.cookie?.split('; ')
      if(!cookies || cookies.length === 0) throw new Error()
      const authCookie = cookies.find((cookie) => cookie.includes('authentication'))
      const authCookieVal = authCookie?.split('authentication=')[1]
      if(!authCookieVal) throw new Error('Cookie not found')
      const payload = this.jwtService.verify(authCookieVal)
      return payload
    } catch(err) {
        throw new UnauthorizedException('Unauthorized')
    }
  }
}
