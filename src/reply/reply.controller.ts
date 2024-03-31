import { Body, Controller, NotFoundException, Param, ParseIntPipe, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ReplyService } from './reply.service';

@Controller('reply')
@UseGuards(AuthGuard())
export class ReplyController {
    constructor(private replyService : ReplyService){}

    @Post('/:commentsId')
    async createReply(
        @Param('commentsId',ParseIntPipe) commentsId: number,
        @GetUser() user : User,
        @Body(ValidationPipe) reply : string,
        @Res() res: Response
    ) : Promise<any>{
        try{
            const response = await this.replyService.createReply(commentsId, user, reply['content']);
            return res.status(201).json({
                content:response['replys'].content,
                createdAt:response['replys'].createdAt,
                nickname:response['nickname'],
            })
        }catch(error){
            console.error(error);
            throw new NotFoundException('Comment not found!');
        }
    }
}
