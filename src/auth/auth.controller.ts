import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Request, Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @Post('/sign-up')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/verify-email')
  verifyEmail(
    @Query('email') email: string,
    @Query('authKey') authKey: string,
  ): Promise<void> {
    return this.authService.verifyEmail({ email, authKey });
  }

  @Post('/reset') // 실제 비밀번호 초기화 controller
  resetPassword(@Query('email') email: string): Promise<void> {
    return this.authService.reset(email);
  }

  // 로그인은 verifed가 true인 User만 가능
  @Post('/sign-in')
  signIn(
    @Res() res: Response,
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<any> {
    return this.authService.signIn(authCredentialsDto, res);
  }

  @Post('/refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const newAccessToken = await this.authService.refresh(refreshTokenDto);
      res.setHeader('Authorization', 'Bearer ' + newAccessToken);
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
      res.send({ newAccessToken });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token!');
    }
  }

  @Delete('/unregister')
  async unregister(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.unregister(authCredentialsDto);
  }

  @Post('/reset-password') // 비밀번호 초기화 이메일 보내는 Controller
  async passwordReset(
    @Query('email') email: string,
    @Query('nickname') nickname: string,
  ): Promise<void> {
    try {
      const reset = await this.authService.resetPassword(email, nickname);
    } catch (error) {
      throw new UnauthorizedException('Invalid email or nickname');
    }
  }
}
