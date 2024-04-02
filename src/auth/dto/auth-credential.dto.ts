import { IsString, MinLength, Matches, IsEmail } from "class-validator";


export class AuthCredentialsDto{
    @IsEmail({}, {message:"Invalid email"})
    email : string;

    @IsString()
    @MinLength(8)
    @Matches(/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*/, {
        message: 'password must contain at least one special character',
    })
    password: string;

    @IsString()
    @MinLength(2)
    nickname: string;
}