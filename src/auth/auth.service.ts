import { Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/auth.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(loginDTO: LoginDTO, res: Response) {
    const { access_token } = await this.validateUser(loginDTO);
    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .send({ access_token, status: 'ok' });
  }

  async logOut(@Res({ passthrough: true }) res) {
    res.cookie('access_token', '', { expires: new Date(Date.now()) });
    return {};
  }

  private async validateUser({
    email,
    password,
  }: LoginDTO): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'User not found',
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Invalid credentials',
        });
      }

      const payload = { sub: user.id, role: user.role, email: user.email };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      throw ErrorManager.createSignatureError(e.message);
    }
  }
}
