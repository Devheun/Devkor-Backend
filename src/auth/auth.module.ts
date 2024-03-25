import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { MailService } from './mail.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject:[ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: process.env.ACCESS_KEY,
        signOptions: { expiresIn: '5m' },
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, MailService,JwtStrategy],
  exports: [JwtStrategy,PassportModule],
})
export class AuthModule {}
