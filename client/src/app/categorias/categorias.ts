import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categoria } from './categoria.models';
import { CategoriaService } from './categoria.service';
import { AuthService } from '../auth/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-categorias',
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias {
  protected readonly authService = inject(AuthService);
  private readonly categoriaService = inject(CategoriaService);

  protected readonly categorias = signal<ReadonlyArray<Categoria>>([]);
  protected readonly titulo = signal('');
  protected readonly categoriaEmEdicao = signal<string | null>(null);
  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  protected readonly mensagemErro = signal<string | null>(null);
  protected readonly mensagemSucesso = signal<string | null>(null);

  constructor() {
    this.carregarCategorias();
  }

  protected carregarCategorias(): void {
    this.carregando.set(true);
    this.mensagemErro.set(null);

    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.carregando.set(false);
      },
      error: (error: unknown) => {
        this.mensagemErro.set(
          this.authService.mensagemErro(error, 'Não foi possível carregar as categorias.')
        );
        this.carregando.set(false);
      },
    });
  }

  protected alterarTitulo(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.titulo.set(input.value);
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);
  }

  protected salvar(): void {
    const titulo = this.titulo().trim();

    if (titulo.length < 2 || titulo.length > 100) {
      this.mensagemErro.set('O título deve ter entre 2 e 100 caracteres.');
      return;
    }

    this.salvando.set(true);
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);

    const id = this.categoriaEmEdicao();
    const request = { titulo };
    const operacao = id
      ? this.categoriaService.atualizar(id, request)
      : this.categoriaService.criar(request);

    operacao.subscribe({
      next: (categoria) => {
        this.categorias.update((categorias) => {
          if (!id) return [...categorias, categoria].sort(this.ordenar);
          return categorias.map((item) => (item.id === id ? categoria : item)).sort(this.ordenar);
        });
        this.limparFormulario();
        this.mensagemSucesso.set(id ? 'Categoria atualizada.' : 'Categoria criada.');
        this.salvando.set(false);
      },
      error: (error: unknown) => {
        this.mensagemErro.set(
          this.authService.mensagemErro(error, 'Não foi possível salvar a categoria.')
        );
        this.salvando.set(false);
      },
    });
  }

  protected editar(categoria: Categoria): void {
    this.categoriaEmEdicao.set(categoria.id);
    this.titulo.set(categoria.titulo);
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);
  }

  protected cancelarEdicao(): void {
    this.limparFormulario();
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);
  }

  protected excluir(categoria: Categoria): void {
    if (!window.confirm(`Excluir a categoria "${categoria.titulo}"?`)) return;

    this.mensagemErro.set(null);
    this.categoriaService.excluir(categoria.id).subscribe({
      next: () => {
        this.categorias.update((categorias) => categorias.filter((item) => item.id !== categoria.id));
        if (this.categoriaEmEdicao() === categoria.id) this.limparFormulario();
        this.mensagemSucesso.set('Categoria excluída.');
      },
      error: (error: unknown) => {
        this.mensagemErro.set(
          this.authService.mensagemErro(error, 'Não foi possível excluir a categoria.')
        );
      },
    });
  }

  private limparFormulario(): void {
    this.titulo.set('');
    this.categoriaEmEdicao.set(null);
  }

  private ordenar(a: Categoria, b: Categoria): number {
    return a.titulo.localeCompare(b.titulo, 'pt-BR');
  }
}
