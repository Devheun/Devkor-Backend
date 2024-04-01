import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardService } from './board.service';
import { Board } from './board.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { PageOptionsDto } from './dto/page-options.dto';
import { PageDto } from './dto/page.dto';

@Controller('board')
@UseGuards(AuthGuard())
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardService.createBoard(createBoardDto, user);
  }

  @Delete('/:boardId')
  async deleteBoard(
    @GetUser() user: User,
    @Param('boardId',ParseIntPipe) boardId: number,
  ): Promise<void> {
    return this.boardService.deleteBoard(boardId, user);
  }

  @Get('/:boardId')
  async getBoardInfo(
    @Param('boardId', ParseIntPipe) boardId: number,
    @GetUser() user: User,
  ) : Promise<any>{
    return this.boardService.getBoardInfo(boardId,user);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) // dto default value 안불러와져서 transfrom true로 설정
  async getBoardList(@Query() pageOptionsDto: PageOptionsDto, @GetUser() user:User) : Promise<PageDto<Board>>{
    return await this.boardService.paginate(pageOptionsDto);
  }
}
