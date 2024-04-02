import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Comments } from './comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsRepository)
        private commentsRepository: CommentsRepository,
    ) {}
    
    async createComment(boardId: number, user: User, comment: string): Promise<any> {
    
        const comments = await this.commentsRepository.createComment(boardId, user, comment);
        const userInfo = await this.commentsRepository.findOne({
            where: {userId : user.id},
            relations: ['user'],
        });
        const nickname = userInfo.user.nickname;
        return {comments,nickname};
    }

    async deleteComment(commentId: number, user: User): Promise<void> {
        return this.commentsRepository.deleteComment(commentId, user);
    }
}
