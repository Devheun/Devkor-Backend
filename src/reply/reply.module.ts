import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Reply } from './reply.entity';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { ReplyRepository } from './reply.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Reply]), AuthModule],
    controllers: [ReplyController],
    providers: [ReplyService,ReplyRepository],
})

export class ReplyModule {}
