import { GameService } from "./../../services/game.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  NgZone,
  Renderer2,
  ViewChildren,
  QueryList
} from "@angular/core";
import { Cell } from "../../models/cell.model";
import { Player } from "../../models/player.model";
import { VictoryService } from '../../services/victory.service';

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent implements OnInit {
  @Input() cells: Cell[][];
  @Input() isGameOver: boolean;
  @Output() tableAction: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren("checker") checkersRef: QueryList<ElementRef>;
  elementsArr: Array<ElementRef<any>>;

  constructor(private gameService: GameService, 
              private victoryService: VictoryService) {}

  ngOnInit() {
    this.gameService.checkerDroped.subscribe(checker => {
      this.elementsArr = this.checkersRef.toArray();
      this.dropChecker(this.elementsArr, checker); 
    });

    this.victoryService.playerWon.subscribe((segments) => {
      this.changeAllCheckersOpacity(this.elementsArr);
      this.changeWinningCheckersOpacity(segments, this.elementsArr);
    });
  }

  makeMove(i, j) {
    this.tableAction.emit({ title: "makeMove", i, j });
  }

  getHighlight(row, column) {
    return (
      this.gameService.possibleMoves.filter(
        move => move.row === row && move.column === column
      ).length > 0
    );
  }

  findElByCoords(elementsArr, row, column) {
    return elementsArr.find(function(element) {
      return (
        +element.nativeElement.id.split(",")[0] === row &&
        +element.nativeElement.id.split(",")[1] === column
      );
    });
  }

  dropChecker(elementsArr, checker) {
    const element = this.findElByCoords(elementsArr, checker.row, checker.column); 
    element.nativeElement.classList.add("fall");
    element.nativeElement.style = `--t: ${this.calcDropYPosition(checker.row)}%`;
  }

  calcDropYPosition(checkerRow) {
    const checkerSizePercentage = 100;
    const rowModifier = 1.5;
    return -checkerSizePercentage*(checkerRow + rowModifier);
  }

  changeAllCheckersOpacity(elementsArr) {
    elementsArr.forEach(element => {
      element.nativeElement.style.opacity = 0.4;
    });
  }

  changeWinningCheckersOpacity(segments, elementsArr) {
    segments.forEach((segment) => {
      const winingEl = this.findElByCoords(elementsArr, segment[0], segment[1]);
      winingEl.nativeElement.style.opacity = 1;
    });
  }
}
