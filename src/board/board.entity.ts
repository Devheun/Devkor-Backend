import { User } from "src/auth/user.entity";
import { ThumbsUp } from "src/thumbsUp/thumbsUp.entity";
import { Column, Entity,ManyToOne,OneToMany,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id :number;

    @Column({nullable:false})
    title : string;

    @Column({nullable:false})
    content : string;

    @Column({nullable:false})
    userId : number;

    @Column({type:'timestamp', nullable:false, default: () => 'CURRENT_TIMESTAMP'})
    createdAt : Date;

    @Column({default: 1})
    viewCount : number;

    @Column({default : 0})
    likeCount : number;

    @ManyToOne(()=>User, user=>user.board,{
        onDelete:'CASCADE'
    })
    user : User;

    @OneToMany(()=>ThumbsUp, thumbsUp => thumbsUp.board)
    thumbsUp: ThumbsUp[];
}