import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';
import { PageOptionsDto } from './dto/page-options.dto';
import { PageDto } from './dto/page.dto';
import { PageMetaDto } from './dto/page-meta.dto';
import { BoardListDto } from './dto/board-list.dto';

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
    const thumbsUpUserNicknames =
      await this.boardRepository.getThumbsUpUserNicknames(boardId);
    const commentsList = boardInfo.comments;
    const commentsAndReplies = commentsList.map(comment => ({
      commentContent : comment.isDeleted? '삭제된 댓글입니다.' : comment.content,
      commentUserNickname : comment.isDeleted? '삭제된 댓글입니다' : comment.user.nickname,
      replies: comment.reply.map((reply) => ({
        replyContent: reply.content,
        replyUserNickname: reply.user.nickname,
      })),
    }));

    return {
      writerNickname,
      createdAt,
      viewCount,
      title,
      likeCount,
      thumbsUpUserNicknames,
      commentsAndReplies,
    };
  }

  async paginate(pageOptionsDto: PageOptionsDto,search:string,order:string = 'likeCount'): Promise<BoardListDto[]> {
    const [boards, total] = await this.boardRepository.findAndCount({
      take: pageOptionsDto.take, //limit : 한 페이지에 가져올 데이터의 제한 갯수 (ex. take=1 이면 한 페이지에 하나의 데이터)
      skip: pageOptionsDto.skip, //offset : 이전의 요청 데이터 개수, 현재 요청이 시작되는 위치 (ex. take=1, 요청 page=1 이면 0부터 시작 )
    });
    const boardsWithCommentsCount = await this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.comments', 'comments')
      .select(['board.id', 'COUNT(comments.id) AS commentsCount'])
      .groupBy('board.id')
      .getRawMany();
    const boardsWithCommentsCountMap = new Map(
      boardsWithCommentsCount.map((board) => [
        board.board_id,
        board.commentsCount,
      ]),
    );

    const boardsWithCommentsCountAdded = boards.map((board) => ({
      ...board,
      commentsCount: parseInt(boardsWithCommentsCountMap.get(board.id)) || 0,
    }));


    const userNicknamesWithId = await this.boardRepository.createQueryBuilder('board')
    .leftJoin('board.user','user')
    .select(['board.id','user.nickname'])
    .getMany();

    const userNicknamesMap = new Map(
        userNicknamesWithId.map((board)=>[board.id,board.user.nickname])
    );

    let boardListDto = boardsWithCommentsCountAdded.map((board)=>({
      title : board.title,
      content: board.content,
      likeCount: board.likeCount,
      viewCount : board.viewCount,
      commentsCount: board.commentsCount,
      nickname : userNicknamesMap.get(board.id),
      createdAt: board.createdAt,
  }));

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, total });
    const lastPage = pageMetaDto.lastPage;
    if (lastPage >= pageMetaDto.page) {
      if (search){
        boardListDto = boardListDto.filter(board => board.content.includes(search) || board.title.includes(search));
      }
      if (order === 'likeCount'){
        boardListDto.sort((a,b)=>b.likeCount - a.likeCount);
      } else if (order === 'createdAt'){
        boardListDto.sort((a,b)=>b.createdAt.getTime() - a.createdAt.getTime());
    } else if (order === 'viewCount'){
        boardListDto.sort((a,b)=>b.viewCount - a.viewCount);
    }
      return boardListDto;
  }
  else {
    throw new NotFoundException(`Page not found!`);
  }
  }
}
