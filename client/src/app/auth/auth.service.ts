import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { URL_API } from './auth.tokens';
import { Router } from '@angular/router';
import { CadastroRequest, LoginRequest, SessaoAutenticada, TokenDto, UsuarioDto } from './auth.models';
import { Observable, tap } from 'rxjs';
import { Token } from '@angular/compiler';

@Service()
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly urlApi = inject(URL_API);

    private readonly sessaoState = signal<SessaoAutenticada | null>(null);
    readonly sessao = this.sessaoState.asReadonly();

    cadastrar(req: CadastroRequest): Observable<UsuarioDto> {
        return this.http.post<UsuarioDto>(`${this.urlApi}/auth/cadastro`, req)
    }

    login(req: LoginRequest): Observable<TokenDto> {
        return this.http.post<TokenDto>(`${this.urlApi}/auth/login`, req).pipe(
            tap(token => this.salvarSessao(token, token.Nome, req.email)));
    }

    private salvarSessao(token: TokenDto, email: string, nome: string): void{
        const usuario: UsuarioDto = { id: token.UsuarioId, nome: nome, email: email };

        const sessao: SessaoAutenticada = {
            token,
            usuario
        }

        this.sessaoState.set(sessao);
    }
}
