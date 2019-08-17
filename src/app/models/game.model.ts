import {Board} from './board.model'
import {Player} from './player.model'
import { Cell } from './cell.model';

export class Game {
    public currTurn: number;
    public board: Board;
    public players: Player[];
    public isOver: boolean;

    constructor(currTurn: number, board: Board, players: Player[], isOver: boolean) {
        this.currTurn = currTurn;
        this.board = board;
        this.players = players;
        this.isOver = isOver;
    }
}