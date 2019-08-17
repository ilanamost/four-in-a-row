import { Move } from './move.model';

export class Player {
    public color: string;
    public score: number;

    constructor(score: number, color: string) {
        this.color = color;
        this.score = score;
    }
}