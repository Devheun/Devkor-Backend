import { Injectable } from '@nestjs/common';
import { ThumbsUpRepository } from './thumbsUp.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { BoardRepository } from 'src/board/board.repository';
import { ThumbsUp } from './thumbsUp.entity';

@Injectable()
export class ThumbsUpService {
  constructor(
    @InjectRepository(ThumbsUpRepository)
    private thumbsUpRepository: ThumbsUpRepository,

    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  async clickLike(boardId: number, user: User): Promise<void> {
    await this.thumbsUpRepository.clickThumbsUp(boardId, user);
    await this.boardRepository.addLikeCount(boardId, user);
    
  }

  async cancelLike(boardId: number, user: User): Promise<void> {
    await this.boardRepository.subLikeCount(boardId, user);
    await this.thumbsUpRepository.cancelThumbsUp(boardId, user);
  }
}
