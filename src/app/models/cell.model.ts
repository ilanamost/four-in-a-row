
export class Cell {
    public row: number;
    public column: number;
    public color: string;


    constructor(row: number, column: number, color: string) {
        this.row = row;
        this.column = column;
        this.color = color;
    }
}