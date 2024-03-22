import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
        private jwtService : JwtService,
        private mailService : MailService,
    ){}

    async signUp(authCredentialsDto : AuthCredentialsDto) : Promise<void>{
        await this.userRepository.createUser(authCredentialsDto);
        return await this.mailService.sendEmail(authCredentialsDto.email);
    }

    async verifyEmail(verifyEmailDto : VerifyEmailDto): Promise<void>{
        const {email, authKey} = verifyEmailDto;
       
        const user = await this.userRepository.findOne({where: {email}});
        if(user.authKey === authKey){ // 인증키가 일치하면
            user.verified = true;
            await this.userRepository.save(user);
        } else{
            throw new Error('인증키가 일치하지 않습니다.');
        }
        return;
    }

}
