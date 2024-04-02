import { Injectable, NotFoundException } from "@nestjs/common";
import { ThumbsUp } from "./thumbsUp.entity";
import { DataSource, Repository } from "typeorm";
import { User } from "src/auth/user.entity";

@Injectable()
export class ThumbsUpRepository extends Repository<ThumbsUp> {
  constructor(dataSource: DataSource) {
    super(ThumbsUp, dataSource.createEntityManager());
  }

  async clickThumbsUp(boardId:number, user: User) : Promise<ThumbsUp>{
    try{
      const thumbsUp = this.create({
        boardId,
        userId : user.id,
      });
      await this.save(thumbsUp);
      return thumbsUp;
    }catch(error){
      //console.error('Error saving thumbsUp:', error);
      throw new NotFoundException('Board not found!');
    }
  }

  async cancelThumbsUp(boardId:number, user:User) : Promise<ThumbsUp>{
    try{
      const thumbsUp = await this.findOne({
        where: {boardId, userId : user.id},
      });
      await this.delete(thumbsUp);
      return thumbsUp;

    }catch(error){
      //console.error('Error deleting thumbsUp:', error);
      throw new NotFoundException('ThumbsUp not found!');
    }
  }
}