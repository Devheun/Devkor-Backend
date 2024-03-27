import { Column, Entity,PrimaryGeneratedColumn } from "typeorm";

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
}