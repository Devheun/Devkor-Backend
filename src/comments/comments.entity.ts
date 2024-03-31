import { User } from "src/auth/user.entity";
import { Board } from "src/board/board.entity";
import { Reply } from "src/reply/reply.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    content: string;

    @Column({nullable:false})
    userId : number;

    @Column({nullable:false})
    boardId : number;

    @Column({type:'timestamp', nullable:false, default: () => 'CURRENT_TIMESTAMP'})
    createdAt : Date;

    @Column({type : 'timestamp', nullable:true})
    deletedAt : Date;

    @Column({default:false})
    isDeleted : boolean;

    @ManyToOne(()=>User, user=>user.comments,{ 
        onDelete:'CASCADE',
    })
    user: User;

    @ManyToOne(()=> Board, board=>board.comments,{
        onDelete:'CASCADE',
    })
    board: Board;

    @OneToMany(()=>Reply, reply=>reply.comments)
    reply: Reply;
}