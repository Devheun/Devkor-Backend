import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Board } from './board.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, content } = createBoardDto;
    const board = this.create({
      title,
      content,
      userId: user.id,
    });
    await this.save(board);
    return board;
  }

  async addLikeCount(boardId: number, user: User): Promise<Board> {
    // boardId에 해당하는 게시글의 좋아요 수를 1 증가
    try {
      const board = await this.findOne({
        where: { id: boardId },
      });
      board.likeCount += 1;
      await this.save(board);
      return board;
    } catch (error) {
      //console.error('Error saving board:', error);
      throw new NotFoundException('Board not found!');
    }
  }

  async subLikeCount(boardId: number, user: User): Promise<Board> {
    // boardId에 해당하는 게시글의 좋아요 수를 1 감소

    try {
      const board = await this.findOne({
        where: {
          id: boardId,
          thumbsUp: {
            userId: user.id,
          },
        },
        relations: ['thumbsUp'],
      });

      board.likeCount -= 1;
      await this.save(board);
      return board;
    } catch (error) {
      //console.error('Error saving board:', error);
      throw new NotFoundException('Board not found!');
    }
  }
  async addViewCount(boardId: number): Promise<Board> {
    try {
      const board = await this.findOne({
        where: { id: boardId },
      });

      board.viewCount += 1;
      await this.save(board);
      return board;
    } catch (error) {
      throw new NotFoundException('Board not found!');
    }
  }

  async getThumbsUpUserNicknames(boardId: number): Promise<string[]> {
    const board = await this.createQueryBuilder('board')
      .leftJoinAndSelect('board.thumbsUp', 'thumbsUp')
      .leftJoinAndSelect('thumbsUp.user', 'user')
      .where('board.id = :boardId', { boardId })
      .getOne();
      return board.thumbsUp.map((thumbsUp) => thumbsUp.user ? thumbsUp.user.nickname : 'Unknown');
  }

}
