import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { User } from './user.entity';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.userRepository.createUser(authCredentialsDto);
    return await this.mailService.sendEmail(authCredentialsDto.email);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const { email, authKey } = verifyEmailDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (user.authKey === authKey) {
      // 인증키가 일치하면
      user.verified = true;
      await this.userRepository.save(user);
    } else {
      throw new Error('인증키가 일치하지 않습니다.');
    }
    return;
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.validateUser(authCredentialsDto);
    if (user) {
      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);

      // 유저 객체에 refresh token 저장
      await this.userRepository.setRefreshToken(refreshToken, user.id);
      res.setHeader('Authorization', 'Bearer ' + accessToken);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
      });

      return res.json({
        message: 'login success',
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  }

  async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {

    const user = await this.userRepository.findOne({
      where: { email: authCredentialsDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (!(await bcrypt.compare(authCredentialsDto.password, user.password))) {
      throw new BadRequestException('Invalid password!');
    }

    if (!user.verified) {
      throw new BadRequestException('User is not verified');
    }

    return user;
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
    return this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: process.env.REFRESH_KEY,
        expiresIn: process.env.REFRESH_EXPIRE,
      },
    );
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<any> {
    const { refreshToken } = refreshTokenDto;
    try {
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_KEY,
      });
      const userId = decodedRefreshToken.id;
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid user!');
      }

      if (!user.refreshToken) {
        // user에 refreshToken이 존재하지 않으면
        return null;
      }

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token!');
      }
      const newAccessToken = await this.generateAccessToken(user);
      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token!');
    }
  }

  async unregister(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    try {
      const user = await this.validateUser(authCredentialsDto);
      if (user) {
        const result = await this.userRepository.delete(user.id);
        if (result.affected === 0) {
          throw new NotFoundException('User not found');
        }
      } else {
        throw new UnauthorizedException('Invalid user!');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid user!');
    }
  }

}
