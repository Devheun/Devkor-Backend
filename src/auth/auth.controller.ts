import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

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
    @Query('authKey') authKey : string,
  ): Promise<void> {
    return this.authService.verifyEmail({email,authKey});
  }

//   // 로그인은 verifed가 true인 User만 가능
//   @Post('/sign-in')
//   signIn(
//     @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
//   ): Promise<{ accessToken: string }> {
//     return this.authService.signIn(authCredentialsDto);
//   }
}
