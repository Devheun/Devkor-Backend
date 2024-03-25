import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

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
  ): Promise<{ accessToken: string }> {
    const user = await this.validateUser(authCredentialsDto);
    if (user) {
      const accessToken = await this.generateAccessToken(user);
      return accessToken;
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

  async generateAccessToken(user: User): Promise<{ accessToken: string }> {
    const payload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  
}
