import { IsEmail } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  authKey: string;
}

