import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Board} from './board/board';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Board],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'connect4-web';
}
