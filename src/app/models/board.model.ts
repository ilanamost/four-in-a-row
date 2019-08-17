import { Cell } from './cell.model'

export class Board {
    public cells: Cell[][];
    public rowsCount: number;
    public colsCount: number;

    constructor(cells :Cell[][], rowsCount: number, colsCount: number) {
        this.cells = cells;
        this.rowsCount = rowsCount;
        this.colsCount = colsCount;
    }

    getCell(row, column) {
        return this.cells[row][column];
    }
}