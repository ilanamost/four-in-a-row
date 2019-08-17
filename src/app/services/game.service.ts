import { Injectable } from "@angular/core";
import { Cell } from "../models/cell.model";
import { Move } from "../models/move.model";
import { Subject } from "rxjs";
import { Board } from "../models/board.model";
import { Game } from "../models/game.model";
import { Player } from "../models/player.model";
import { VictoryService } from "./victory.service";

@Injectable({ providedIn: "root" })
export class GameService {
  game: Game;
  players: Player[] = [];
  currTurn: number = 0;
  possibleMoves: Move[];
  isGameOver: boolean = false;
  winner: Player;
  gameEnded = new Subject<boolean>();
  checkerDroped = new Subject<Cell>();
  lastPlayedCell: Cell;

  constructor(private victoryService: VictoryService) {}

  create2DArray(rows, cols) {
    let arr = [];
    for (let i = 0; i < rows; i++) {
      arr[i] = [];

      for (let j = 0; j < cols; j++) {
        arr[i][j] = null;
      }
    }

    return arr;
  }

  initCells(rowsCount, colsCount) {
    let arr = this.create2DArray(rowsCount, colsCount);

    for (let i = 0; i < arr.length; i++) {
      let row = arr[i];
      for (let j = 0; j < row.length; j++) {
        let cell = new Cell(i, j, "");
        row[j] = cell;
      }
    }
    return arr;
  }

  initMoves(currBoard) {
    const board = currBoard.cells;
    let moves: Move[] = [];

    for (let i = board.length - 1; i < board.length; i++) {
      let row = board[i];

      for (let j = 0; j < row.length; j++) {
        const move: Move = new Move(i, j);
        moves.push(move);
      }
    }
    return moves;
  }

  getPossibleMoves(moves, currMove) {
    let moveIdx = moves.findIndex(
      move => move.row === currMove.row && move.column === currMove.column
    );
    moves.splice(moveIdx, 1);
    if (currMove.row > 0) {
      moves.push(new Move(currMove.row-1, currMove.column));
    }
    return moves;
  }

  initGame(firstGame) {
    const cells = this.initCells(6, 7);
    const board = new Board(cells, 6, 7);
    this.possibleMoves = this.initMoves(board);
    this.players = this.createPlayers(this.players);
    
    this.game = new Game(
      this.currTurn,
      board,
      this.players,
      this.isGameOver
    );
  }

  createPlayers(oldPlayers) {
    let players = oldPlayers;

    if(this.isFirstGame()) {
      const playerOne = new Player(0, "red");
      const playerTwo = new Player(0, "blue");
      players = [playerOne, playerTwo];
    }

    return players;
  }

  isFirstGame() {
    return this.players.length === 0;
  }

  makeMove(row, column) {
    if(this.banMove(row, column)) return;

    const cell = this.game.board.getCell(row, column);
    cell.color = this.players[this.currTurn].color;
    this.checkerDroped.next(
      new Cell(row, column, this.players[this.currTurn].color)
    );
    this.lastPlayedCell = cell;
    this.possibleMoves = this.getPossibleMoves(this.possibleMoves, {
      row: row,
      column: column
    });

    const isVictory = this.victoryService.hasGameEndedInVictory(this.game.board,
                                                                this.lastPlayedCell);
    this.game.isOver = isVictory || this.isTie(isVictory);

    this.handleGameEndOrContinue(isVictory);
  }

  banMove(row, column) {
    const cell = this.game.board.getCell(row, column);
    
    if (cell.color !== "" || this.game.isOver) {
      return true;
    }

    if (!this.possibleMoves.find(move => move.row === row && move.column === column)) {
      return true;
    }
  }

  switchTurn() {
    this.currTurn = (this.currTurn + 1) % this.players.length;
  }

  handleGameEndOrContinue(isVictory) {
    if (this.game.isOver) {
      this.handleGameEnd(isVictory);
    } else {
      this.switchTurn();
    }
  }

  handleGameEnd(isVictory) {
    if (!this.isTie(isVictory)) {
      this.setWinner();
    }
    this.gameEnded.next(true);
  }

  setWinner() {
    this.players[this.currTurn].score += 5;
    this.winner = this.players[this.currTurn];
  }

  isTie(isVictory) {
    if (this.possibleMoves.length === 0) {
      return !isVictory;
    }
    return false;
  }

  closeModal() {
    this.winner = null;
  }

  resetGame() {
    this.game.isOver = false;
    this.winner = null;
    this.currTurn = 0;
    this.initGame(false);
  }
}
