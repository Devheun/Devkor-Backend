import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { User } from './auth/user.entity';
import { BoardModule } from './board/board.module';
import { Board } from './board/board.entity';
import { LikeModule } from './thumbsUp/thumbsUp.module';
import { ThumbsUp } from './thumbsUp/thumbsUp.entity';
import { CommentsModule } from './comments/comments.module';
import { Comments } from './comments/comments.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User,Board,ThumbsUp,Comments],
      synchronize: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.naver.com',
          port: 465,
          auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: `Siheun <${process.env.EMAIL_ADDRESS}>`,
        },
      }),
    }),
    AuthModule,
    BoardModule,
    LikeModule,
    CommentsModule,
  ],
})
export class AppModule {}
