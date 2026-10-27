import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { URL_API } from './auth.tokens';
import { Router } from '@angular/router';
import { CadastroRequest, LoginRequest, TokenDto, UsuarioDto } from './auth.models';
import { Observable } from 'rxjs';
import { Token } from '@angular/compiler';

@Service()
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly urlApi = inject(URL_API);

    cadastrar(req: CadastroRequest): Observable<UsuarioDto> {
        return this.http.post<UsuarioDto>(`${this.urlApi}/auth/cadastro`, req)
    }

    login(req: LoginRequest): Observable<TokenDto> {
        return this.http.post<TokenDto>(`${this.urlApi}/auth/login`, req);
    }
}
