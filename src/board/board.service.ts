import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }
  async deleteBoard(boardId: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({
      id: boardId,
      userId: user.id,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Can't find Board with id ${boardId} with your account!`,
      );
    }
  }
  async addLikeCount(boardId: number, user: User): Promise<Board> {
    // boardId에 해당하는 게시글의 좋아요 수를 1 증가
    return await this.boardRepository.addLikeCount(boardId, user);
  }

  async subLikeCount(boardId: number, user: User): Promise<Board> {
    // boardId에 해당하는 게시글의 좋아요 수를 1 감소
    return await this.boardRepository.subLikeCount(boardId, user);
  }

  async getBoardInfo(boardId: number, user: User): Promise<Object> {
    await this.boardRepository.addViewCount(boardId);
    const boardInfo = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: [
        'user',
        'comments',
        'comments.user',
        'comments.reply',
        'comments.reply.user',
      ],
    });
    
    const writerNickname = boardInfo.user.nickname;
    const createdAt = boardInfo.createdAt;
    const viewCount = boardInfo.viewCount;
    const title = boardInfo.title;
    const likeCount = boardInfo.likeCount;
    const thumbsUpUserNicknames = await this.boardRepository.getThumbsUpUserNicknames(boardId);
    const commentsList = boardInfo.comments;
    const commentsAndReplies = commentsList.map((comment) => ({
      commentContent: comment.content,
      commentUserNickname: comment.user.nickname,
      replies: comment.reply.map((reply) => ({
        replyContent: reply.content,
        replyUserNickname: reply.user.nickname,
      })),
    }));

    return {writerNickname,createdAt,viewCount,title,likeCount,thumbsUpUserNicknames,commentsAndReplies};
  }
}
