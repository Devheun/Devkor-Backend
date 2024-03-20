import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}

    @Post('/sign-up')
    signUp(@Body(ValidationPipe) authCredentialsDto : AuthCredentialsDto) : Promise<void>{
        return this.authService.signUp(authCredentialsDto);
    }

}
