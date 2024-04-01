import { Board } from "../board.entity";

export class BoardListDto{
    title:string;
    content:string;
    likeCount:number;
    commentsCount:number;
    nickname:string;
    createdAt:Date;
}