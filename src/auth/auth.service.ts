import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
    ){}

    async signUp(authCredentialsDto : AuthCredentialsDto) : Promise<void>{
        return await this.userRepository.createUser(authCredentialsDto);
    }
}
