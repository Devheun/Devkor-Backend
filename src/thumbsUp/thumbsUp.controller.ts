import { BadRequestException, Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThumbsUpService } from './thumbsUp.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ThumbsUp } from './thumbsUp.entity';

@Controller('thumbsUp')
@UseGuards(AuthGuard())
export class ThumbsUpController {
    constructor(private thumbsUpService: ThumbsUpService) {}

    @Post('/:boardId')
    async clickLike(@Param('boardId',ParseIntPipe) boardId: number, @GetUser() user: User) : Promise<void> {
        try{
            return await this.thumbsUpService.clickLike(boardId,user);
        }catch(error){
            throw new BadRequestException("You already clicked thumbs up or Not found board!");
        }
    }

    @Delete('/cancel/:boardId')
    async cancelLike(@Param('boardId',ParseIntPipe) boardId: number, @GetUser() user: User) : Promise<void>{
        try{
            return await this.thumbsUpService.cancelLike(boardId,user);
        }catch(error){
            throw new BadRequestException("You didn't click thumbs up! or Not found board!");
        }
    }
}
