import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'Jwt') {
  constructor(
    private readonly configService: ConfigService
  ) {
    const jwtSecret = configService.getOrThrow('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies.authentication
        }
      ]),
      secretOrKey: jwtSecret
    })
  }

  validate(payload: TokenPayload) {
    return payload
  }
}