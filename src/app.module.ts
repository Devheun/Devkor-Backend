import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(typeORMConfig)],
})
export class AppModule {}
