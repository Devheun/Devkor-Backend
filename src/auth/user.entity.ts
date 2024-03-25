import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  authKey : string;

  @Column({default:false})
  verified: boolean;

  @Column({nullable:true})
  refreshToken : string;

  @Column({type:'datetime', nullable:true})
  refreshExp : Date;

}
