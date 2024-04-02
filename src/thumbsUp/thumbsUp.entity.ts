import { User } from "src/auth/user.entity";
import { Board } from "src/board/board.entity";
import { Column, Entity,ManyToOne,OneToMany,PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name : 'thumbsup'}) // camel case로 변환되는거 막으려고 명시적으로 이름 지정
@Unique(['userId','boardId']) // user와 board의 조합이 unique하게
export class ThumbsUp {
    @PrimaryGeneratedColumn()
    id :number;

    @Column({nullable:false})
    boardId : number;

    @Column({nullable:false})
    userId : number;

    @ManyToOne(()=>Board, board=>board.thumbsUp,{ // board가 삭제될 때 like도 삭제
        onDelete:'CASCADE',
    })
    board: Board;

    @ManyToOne(()=>User, user=>user.thumbsUp,{ // user가 삭제될 때 like도 삭제
        onDelete:'CASCADE',
    })
    user: User;
}