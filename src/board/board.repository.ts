import { Injectable } from "@nestjs/common";
import { Board } from "./board.entity";
import { DataSource, Repository } from "typeorm";
import { CreateBoardDto } from "./dto/create-board.dto";
import { User } from "src/auth/user.entity";

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async createBoard (createBoardDto : CreateBoardDto, user : User): Promise<Board> {
    const {title, content} = createBoardDto;
    const board = this.create({
      title,
      content,
      userId : user.id,
    });
    await this.save(board);
    return board;
  }
}