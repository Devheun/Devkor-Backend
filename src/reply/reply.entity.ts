import { User } from "src/auth/user.entity";
import { Board } from "src/board/board.entity";
import { Comments } from "src/comments/comments.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Reply {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    content: string;

    @Column({nullable:false})
    userId : number;

    @Column({nullable:false})
    commentsId : number;

    @Column({type:'timestamp', nullable:false, default: () => 'CURRENT_TIMESTAMP'})
    createdAt : Date; 

    @ManyToOne(()=>User, user=>user.reply,{ 
        onDelete:'CASCADE',
    })
    user: User;

    @ManyToOne(()=> Comments, comments=>comments.reply)
    comments: Comments;
}