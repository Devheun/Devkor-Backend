import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Reply } from './reply.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyRepository } from './reply.repository';

@Injectable()
export class ReplyService {
    constructor(
        @InjectRepository(ReplyRepository)
        private replyRepository: ReplyRepository,
    ){}

    async createReply(commentId: number, user:User, reply:string) : Promise<any>{
        const replys = await this.replyRepository.createReply(commentId, user, reply);
        const userInfo = await this.replyRepository.findOne({
            where: {userId : user.id},
            relations: ['user']
        });
        const nickname = userInfo.user.nickname;
        return {replys, nickname};
    }

    async deleteReply(replyId:number, user:User): Promise<Reply>{
        return this.replyRepository.deleteReply(replyId, user);
    }
}
