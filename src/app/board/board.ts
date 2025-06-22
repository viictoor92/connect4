import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import { Player } from '../models/player';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-board',
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './board.html',
  styleUrl: './board.css'
})
export class Board {
  numRows = 6;
  numCols = 7;
  lastStartingPlayer: Player;
  actualPlayer: Player | undefined;
  board: (Player|undefined)[][] = [];
  gameOver: boolean = false;
  players: Player[] = this.initPlayers();
  winner: Player | undefined;
  hoverColumn: number | null = null;
  fillPlayers: boolean = false;
  indexFillPlayer: number = 0;
  tempName: string = '';

  constructor() {
    this.lastStartingPlayer = this.players[1];
    this.actualPlayer = this.lastStartingPlayer;
    this.resetBoard();
  }

  initPlayers() {
    return [new Player('player1', 'Jugador 1'), new Player('player2', 'Jugador 2')]
  }

  fillPlayer() {
    this.changePlayer();
    this.players[this.indexFillPlayer].name = this.tempName;
    this.tempName = '';
    this.indexFillPlayer++;

    if (this.indexFillPlayer == 2) {
        this.fillPlayers = true;
    }

  }

  resetBoard() {
    this.gameOver = false;
    this.lastStartingPlayer = this.players.find(player => player.id != this.lastStartingPlayer.id)!;
    this.actualPlayer = this.lastStartingPlayer;
    this.board = Array.from({ length: this.numRows }, () =>
      Array(this.numCols).fill(undefined)
    );
  }

  getPreviewRow(col: number): number | null {
    for (let i = this.numRows - 1; i >= 0; i--) {
      if (!this.board[i][col]) {
        return i;
      }
    }
    return null;
  }

  resetScores() {
    this.players.forEach(player => player.score = 0)
    this.resetBoard();
  }

  makeMove(j: number) {
    let found: boolean = false
    let i = this.numRows - 1;
    while (!found && i >= 0) {
      if (!this.board[i][j]) {
        found = !found;
        this.board[i][j] = this.actualPlayer;
      } else {
        i--;
      }
    }
    if (this.checkWinner(i, j)) {
      this.winner = this.actualPlayer;
      this.players.find(player => player === this.actualPlayer)!.score++;
      this.gameOver = true;
    } else {
      this.changePlayer();
    }
}

  changePlayer() {
    this.actualPlayer = this.players.find(player => player.name != this.actualPlayer?.name);
  }

  checkWinner(i: number, j: number): boolean {
    return (
      this.checkDirection(i, j, 0, 1) ||   // Horizontal
      this.checkDirection(i, j, 1, 0) ||   // Vertical
      this.checkDirection(i, j, 1, 1) ||   // Diagonal ↘
      this.checkDirection(i, j, 1, -1)     // Diagonal ↙
    );
  }

  checkDirection(i: number, j: number, deltaI: number, deltaJ: number): boolean {
    let count = 1;

    count += this.countInDirection(i, j, deltaI, deltaJ);
    count += this.countInDirection(i, j, -deltaI, -deltaJ);

    return count >= 4;
  }

  countInDirection(i: number, j: number, deltaI: number, deltaJ: number): number {
    let count = 0;
    let row = i + deltaI;
    let col = j + deltaJ;

    while (
      row >= 0 && row < this.numRows &&
      col >= 0 && col < this.numCols &&
      this.board[row][col] === this.actualPlayer
      ) {
      count++;
      row += deltaI;
      col += deltaJ;
    }

    return count;
  }
}
