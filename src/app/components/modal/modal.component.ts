import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() winner: Player;
  @Output() modalAction: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  resetGame() {
    this.modalAction.emit('resetGame');
  }

  closeModal() {
    this.modalAction.emit('closeModal');
  }

}
