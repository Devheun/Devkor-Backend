import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsController } from './comments.controller';
import { Comments } from './comments.entity';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Comments]), AuthModule],
    controllers: [CommentsController],
    providers: [CommentsService,CommentsRepository],
})

export class CommentsModule {}
