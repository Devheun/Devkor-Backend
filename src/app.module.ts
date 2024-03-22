import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(typeORMConfig),
  MailerModule.forRootAsync({
    useFactory: () => ({
      transport: {
        host: "smtp.naver.com",
        port : 465,
        auth : {
          user:process.env.EMAIL_ADDRESS,
          pass:process.env.EMAIL_PASSWORD
        }
      },
      defaults:{
        from : `Siheun <${process.env.EMAIL_ADDRESS}>`,
      }
    })

  }), ConfigModule.forRoot({
    isGlobal: true,
  })],
})
export class AppModule {}
