import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Comments } from './comments.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class CommentsRepository extends Repository<Comments> {
  constructor(dataSource: DataSource) {
    super(Comments, dataSource.createEntityManager());
  }
  async createComment(
    boardId: number,
    user: User,
    comment: string,
  ): Promise<any> {
    try {
      const comments = this.create({
        boardId,
        userId: user.id,
        content: comment,
      });
      const userInfo = await this.findOne({
        where: {userId : user.id},
        relations: ['user'],
      });
      const nickname = userInfo.user.nickname;

      await this.save(comments);
      return {comments,nickname};
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Board not found!');
    }
  }
  async deleteComment(commentId: number, user: User): Promise<void> {
    try{
        const comment = await this.findOne({
            where : {id : commentId},
        })
        if(comment.userId !== user.id){
            throw new UnauthorizedException('Unauthorized action!');
        }
        comment.isDeleted = true;
        comment.deletedAt = new Date();
        await this.save(comment);
    }catch(error){
        console.error(error);
        throw new NotFoundException('Comment not found!');
    }
  }
}
