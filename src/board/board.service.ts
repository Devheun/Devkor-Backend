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

    async createBoard(createBoardDto : CreateBoardDto, user:User): Promise<Board>{
        return this.boardRepository.createBoard(createBoardDto,user);
    }
    async deleteBoard(boardId:number, user:User): Promise<void>{
       const result = await this.boardRepository.delete({id:boardId, userId:user.id});
       if (result.affected === 0){
           throw new NotFoundException(`Can't find Board with id ${boardId} with your account!`);
       }
    }
    async addLikeCount(boardId:number, user:User) : Promise<Board>{ // boardId에 해당하는 게시글의 좋아요 수를 1 증가
        return await this.boardRepository.addLikeCount(boardId,user);
    }

    async subLikeCount(boardId:number, user: User) : Promise<Board>{ // boardId에 해당하는 게시글의 좋아요 수를 1 감소
        return await this.boardRepository.subLikeCount(boardId,user);
    }
}
