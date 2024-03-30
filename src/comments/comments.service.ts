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
    
    async createComment(boardId: number, user: User, comment: string): Promise<Comments> {
        return this.commentsRepository.createComment(boardId, user, comment);
    }
}
