import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThumbsUpController } from './thumbsUp.controller';

import { ThumbsUpService } from './thumbsUp.service';
import { ThumbsUpRepository } from './thumbsUp.repository';
import { BoardModule } from 'src/board/board.module';
import { BoardRepository } from 'src/board/board.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ThumbsUp } from './thumbsUp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThumbsUp]), AuthModule],
  controllers: [ThumbsUpController],
  providers: [ThumbsUpService, ThumbsUpRepository, BoardRepository],
})
export class LikeModule {}
