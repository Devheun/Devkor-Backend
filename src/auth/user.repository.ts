import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(dataSource : DataSource){
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialsDto : AuthCredentialsDto) : Promise<void>{
        const {email, password, nickname} = authCredentialsDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({email, password: hashedPassword, nickname});
        await this.save(user);
    }
}