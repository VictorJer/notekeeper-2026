import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Categoria } from '../categorias/categoria.models';
import { CategoriaService } from '../categorias/categoria.service';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  protected readonly authService = inject(AuthService);
  protected readonly sessaoAutenticada = inject(AuthService).sessao;
  private readonly categoriaService = inject(CategoriaService);
  protected readonly categorias = signal<ReadonlyArray<Categoria>>([]);
  protected readonly categoriasCarregando = signal(true);
  protected readonly categoriasErro = signal<string | null>(null);

  constructor() {
    if (this.sessaoAutenticada()) {
      this.carregarCategorias();
    } else {
      this.categoriasCarregando.set(false);
    }
  }

  protected carregarCategorias(): void {
    this.categoriasCarregando.set(true);
    this.categoriasErro.set(null);

    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.categoriasCarregando.set(false);
      },
      error: (error: unknown) => {
        this.categoriasErro.set(
          this.authService.mensagemErro(error, 'Não foi possível carregar as categorias.')
        );
        this.categoriasCarregando.set(false);
      },
    });
  }
}
