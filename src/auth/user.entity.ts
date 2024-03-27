import { Board } from 'src/board/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany(()=>Board, board=>board.user)
  board: Board[];

}
