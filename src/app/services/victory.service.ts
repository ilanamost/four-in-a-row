import { Injectable } from "@angular/core";
import { Cell } from "../models/cell.model";
import { Subject } from "rxjs";

const SEGMENTS_LENGTH = 4;

@Injectable({ providedIn: "root" })
export class VictoryService {
  playerWon = new Subject<number[][]>();

  hasGameEndedInVictory(board, lastPlayedCell) {
    const minCol = this.getMin(lastPlayedCell.column);
    const maxCol = this.getMax(lastPlayedCell.column, board.colsCount - 1);
    const minRow = this.getMin(lastPlayedCell.row);
    const maxRow = this.getMax(lastPlayedCell.row, board.rowsCount - 1);

    const isHorizontalVictory = this.checkHorizontalSegments(
      lastPlayedCell.row,
      minCol,
      maxCol,
      board.cells
    );

    const isVerticalVictory = this.checkVerticalSegments(
      lastPlayedCell.column,
      minRow,
      maxRow,
      board.cells
    );

    const isLeftDiagVictory = this.checkLeftDiagSegments(
      lastPlayedCell.row,
      lastPlayedCell.column,
      minRow,
      minCol,
      maxRow,
      maxCol,
      board.cells
    );

    const isRightDiagVictory = this.checkRightDiagSegments(
      lastPlayedCell.row,
      lastPlayedCell.column,
      minRow,
      minCol,
      maxRow,
      maxCol,
      board.cells
    );

    const isVictory =
      isHorizontalVictory ||
      isVerticalVictory ||
      isLeftDiagVictory ||
      isRightDiagVictory;

    return isVictory;
  }

  getMin(num) {
    return Math.max(num - 3, 0);
  }

  getMax(num, max) {
    return Math.min(num + 3, max);
  }

  getSegments(type, row, column) {
    switch (type) {
      case "horizontal":
        return [[row, column], [row, column + 1], [row, column + 2], [row, column + 3]];

      case "vertical":
        return [[row, column], [row + 1, column], [row + 2, column], [row + 3, column]];
    }
  }

  isWinnerInSegments(segments, cells) {
    if (this.isWinner(segments, cells)) {
      this.playerWon.next(segments);
      return true;
    }
    return false;
  }

  checkHorizontalSegments(row, minCol, maxCol, cells) {
    for (let column = minCol; column + 3 <= maxCol; column++) {
      const segments = this.getSegments("horizontal", row, column);

      const isWinner = this.isWinnerInSegments(segments, cells);
      if (isWinner) {
        return true;
      }
    }
    return false;
  }

  checkVerticalSegments(lastCellCol, minRow, maxRow, cells) {
    for (let column = lastCellCol, row = minRow; row + 3 <= maxRow; row++) {
      const segments = this.getSegments("vertical", row, column);
      const isWinner = this.isWinnerInSegments(segments, cells);
      if (isWinner) {
        return true;
      }
    }
    return false;
  }

  checkLeftDiagSegments(
    lastCellRow,
    lastCellCol,
    minRow,
    minCol,
    maxRow,
    maxCol,
    cells
  ) {
    const segments = this.getLeftDiagSegments(
      lastCellRow,
      lastCellCol,
      minRow,
      minCol,
      maxRow,
      maxCol
    );

    const isWinner = this.isWinnerInSegments(segments, cells);
    if (isWinner) {
      return true;
    }

    return false;
  }

  checkRightDiagSegments(
    lastCellRow,
    lastCellCol,
    minRow,
    minCol,
    maxRow,
    maxCol,
    cells
  ) {
    const segments = this.getRightDiagSegments(
      lastCellRow,
      lastCellCol,
      maxRow,
      minCol,
      minRow,
      maxCol
    );

    const isWinner = this.isWinnerInSegments(segments, cells);
    if (isWinner) {
      return true;
    }
    return false;
  }

  getLeftDiagSegments(
    lastCellRow,
    lastCellCol,
    minRow,
    minCol,
    maxRow,
    maxCol
  ) {
    let segments = [];

    for (
      let [row, col] = this.startLeftDiag(
        lastCellRow,
        lastCellCol,
        minRow,
        minCol
      );
      row <= maxRow && col <= maxCol;
      row++, col++
    ) {
      segments.push([row, col]);
    }

    while (segments.length > SEGMENTS_LENGTH) {
      segments.shift();
    }

    return segments;
  }

  getRightDiagSegments(
    lastCellRow,
    lastCellCol,
    maxRow,
    minCol,
    minRow,
    maxCol
  ) {
    let segments = [];

    for (
      let [row, col] = this.startRightDiag(
        lastCellRow,
        lastCellCol,
        maxRow,
        minCol
      );
      row >= minRow && col <= maxCol;
      row--, col++
    ) {
      segments.push([row, col]);
    }

    while (segments.length > SEGMENTS_LENGTH) {
      segments.pop();
    }
    return segments;
  }

  startLeftDiag(row, column, minRow, minCol) {
    while (row > minRow && column > minCol && row > 0 && column > 0) {
      row--;
      column--;
    }
    return [row, column];
  }

  startRightDiag(row, column, maxRow, minCol) {
    while (row < maxRow && column > minCol) {
      row++;
      column--;
    }
    return [row, column];
  }

  getCell(row, column, cells) {
    return cells[row][column];
  }

  getCellsToCheck(segments, cells) {
    return segments.map(([row, column]) => this.getCell(row, column, cells));
  }

  areCellsOfSameColor(cellsToCheck) {
    const firstCell = cellsToCheck[0];
    if (
      cellsToCheck.reduce((acc, cell) => {
        return acc.color === cell.color && acc;
      }, firstCell)
    ) {
      return true;
    }
    return false;
  }

  isWinner(segments, cells) {
    if (segments.length < SEGMENTS_LENGTH) return false;
    const cellsToCheck = this.getCellsToCheck(segments, cells);
    return this.areCellsOfSameColor(cellsToCheck);
  }
}
