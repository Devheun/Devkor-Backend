import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
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
}
