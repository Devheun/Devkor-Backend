import {
  Body,
  Controller,
  Post,
  Query,
  Res,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Response } from 'express';
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
  ) {
    try {
      const newAccessToken = await this.authService.refresh(refreshTokenDto);
      res.setHeader('Authorization', 'Bearer ' + newAccessToken);
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
      res.send({ newAccessToken });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token!');
    }
  }
}
