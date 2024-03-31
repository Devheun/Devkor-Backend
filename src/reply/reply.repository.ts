import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Reply } from './reply.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ReplyRepository extends Repository<Reply> {
  constructor(dataSource: DataSource) {
    super(Reply, dataSource.createEntityManager());
  }

  async createReply(
    commentsId: number,
    user: User,
    reply: string,
  ): Promise<Reply> {
    try {
      const replys = this.create({
        commentsId,
        userId: user.id,
        content: reply,
      });

      await this.save(replys);
      return replys;
    } catch (error) {
        console.log(user);
      console.error(error);
      throw new NotFoundException('Comment not found!');
    }
  }
}
