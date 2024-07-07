import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PublicAccess } from './decorators/public.decorator';
import { LoginDTO } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAccess()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDTO: LoginDTO, @Res() res: Response) {
    return this.authService.login(loginDTO, res);
  }

  @Get('profile')
  getProfile(@Req() req): Promise<User> {
    return req.user;
  }

  @Post('log-out')
  async logOut(@Res({ passthrough: true }) res) {
    return this.authService.logOut(res);
  }
}
