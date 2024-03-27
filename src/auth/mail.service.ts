import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException } from '@nestjs/common';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async sendEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    const authKey = user.authKey;

    this.mailerService
      .sendMail({
        to: `${email}`,
        from: process.env.EMAIL_ADDRESS,
        subject: '회원가입 메일',
        html: `<p>회원가입을 위해서는 해당 링크를 클릭하세요!</p>
        <form action="${process.env.BASE_URL}/auth/verify-email?email=${email}&authKey=${authKey}" method="POST">
        <button type="submit">인증링크</button>
      </form>`,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        new ConflictException(error);
      });
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    this.mailerService.sendMail({
      to: `${email}`,
      from: process.env.EMAIL_ADDRESS,
      subject: '비밀번호 초기화',
      html: `<p>비밀번호 초기화를 위해서는 초기화 버튼을 클릭하세요!</p>
      <form action="${process.env.BASE_URL}/auth/reset?email=${email}" method="POST">
      <button type="submit">초기화</button>
      </form>`,
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      new ConflictException(error);
    });;
  }
}
