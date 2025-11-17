import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "src/user/user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly userService: UserService
  ) {
    super({
      usernameField: 'email'
    })
  }

  async validate(email: string, password: string) {
    try {
      return await this.userService.verfiyUser(email, password)
    } catch(err) {
      throw new UnauthorizedException("Credentials are not valid")
    }
  }
}