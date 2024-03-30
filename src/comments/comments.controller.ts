import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CommentsService } from './comments.service';
import { Comments } from './comments.entity';
import { Response } from 'express';

@Controller('comments')
@UseGuards(AuthGuard())
export class CommentsController {
  constructor(private commentsService : CommentsService) {}

  @Post('/:boardId')
  async createComment(
    @Param('boardId', ParseIntPipe) boardId: number,
    @GetUser() user: User,
    @Body(ValidationPipe) comment: string,
    @Res() res: Response
  ): Promise<any> {
    try{
        const response = await this.commentsService.createComment(boardId, user,comment['content']);
        console.log(response);
        return res.status(201).json({
            content:response['comments'].content,
            createdAt:response['comments'].createdAt,
            nickname:response['nickname'],
        })
    }catch(error){
        console.error(error);
        throw new NotFoundException('Board not found!')
    }
  }

  @Patch('cancel/:commentId')
  async cancelComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @GetUser() user: User,
    @Res() res: Response
  ): Promise<any> {
    try{
        await this.commentsService.deleteComment(commentId, user);
        return res.status(200).json({
            message: 'Comment deleted!',
        })
    }catch(error){
        console.error(error);
        throw new NotFoundException('Comment not found!')
    }
  }
}
