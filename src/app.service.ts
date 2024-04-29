import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'New laptop CI/CD Test!!!';
  }
}
