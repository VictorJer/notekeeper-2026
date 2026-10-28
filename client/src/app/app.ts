import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('notekeeper');

  protected readonly modoEscuro = signal(false);

  constructor() {
    const salvo = localStorage.getItem('notekeeper-modo-escuro') === 'true';
    this.aplicarModo(salvo);
  }

  protected alternarModo(): void {
    this.aplicarModo(!this.modoEscuro());
  }

  private aplicarModo(escuro: boolean): void {
    this.modoEscuro.set(escuro);
    document.body.classList.toggle('modo-escuro', escuro);
    localStorage.setItem('notekeeper-modo-escuro', String(escuro));
  }
}
