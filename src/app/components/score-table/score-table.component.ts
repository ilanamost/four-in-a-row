import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit {
  @Input() playerOneScore: number;
  @Input() playerTwoScore: number;

  constructor() { }

  ngOnInit() {
  }

}
