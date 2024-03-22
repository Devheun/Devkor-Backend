import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import {v1 as uuid} from "uuid";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password, nickname } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const authKey = uuid();
    // 처음에 회원 만들때는 인증이 안된 상태
    // authKey는 random value
    const user = this.create({ email, password: hashedPassword, nickname, authKey, verified : false });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') { // email 중복되면
        throw new ConflictException('Existing email or nickname!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
