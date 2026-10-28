import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { URL_API } from '../auth/auth.tokens';
import { Categoria, CategoriaRequest } from './categoria.models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly urlApi = inject(URL_API);

  listar(): Observable<ReadonlyArray<Categoria>> {
    return this.http.get<ReadonlyArray<Categoria>>(`${this.urlApi}/categorias`, {
      headers: this.headers(),
    });
  }

  criar(request: CategoriaRequest): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.urlApi}/categorias`, request, {
      headers: this.headers(),
    });
  }

  atualizar(id: string, request: CategoriaRequest): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.urlApi}/categorias/${id}`, request, {
      headers: this.headers(),
    });
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/categorias/${id}`, {
      headers: this.headers(),
    });
  }

  private headers(): HttpHeaders {
    const accessToken = this.authService.sessao()?.token.accessToken;

    return accessToken
      ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
      : new HttpHeaders();
  }
}
