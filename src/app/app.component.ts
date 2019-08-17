import { Component } from '@angular/core';
import { Game } from './models/game.model'
import { Board } from './models/board.model';
import { Player } from './models/player.model';
import { Cell } from './models/cell.model';
import { Move } from './models/move.model';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'four-in-a-row';
  isModalOpen = false;

  constructor(private gameService: GameService) {}
  
  get winner(): Player {
    return this.gameService.winner;
  }

  get isGameOver(): boolean {
    return this.gameService.game.isOver;
  }

  get playerOneScore(): number {
    return this.gameService.players.length > 0 ? this.gameService.players[0].score : 0;
  }

  get playerTwoScore(): number {
    return this.gameService.players.length > 0 ? this.gameService.players[1].score : 0;
  }

  get cells(): Cell[][] {
    return this.gameService.game.board.cells;
  }
 
  ngOnInit() {
    this.gameService.initGame(true);
    this.gameService.gameEnded.subscribe((res) => {
      setTimeout(() => {
        this.isModalOpen = true;
      }, 850);
    });
  }

  onModalAction(type) {
    switch(type) {
      case 'resetGame':
        this.gameService.resetGame();
        break;

      case 'closeModal':
        this.gameService.closeModal();
        break;
    }
    this.isModalOpen = false;
  }

  onTableAction(type) {
    switch(type.title) {
      case 'makeMove':
        this.gameService.makeMove(type.i, type.j);
        break;
    }
  }
}
