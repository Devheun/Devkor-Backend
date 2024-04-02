import { IsNotEmpty } from "class-validator";
import { User } from "src/auth/user.entity";

export class CreateCommentsDto {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    user: User;

    @IsNotEmpty()
    boardId : number;
}