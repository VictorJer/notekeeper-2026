import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CHAVE_ARMAZENAMENTO, URL_API } from './auth.tokens';
import { CadastroRequest, LoginRequest, SessaoAutenticada, TokenDto, UsuarioDto } from './auth.models';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface SessaoPersistidaAnteriormente {
    readonly token?: TokenDto;
    readonly usuario?: UsuarioDto;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly urlApi = inject(URL_API);
    private readonly router = inject(Router);
    private readonly chaveArmazenamento = inject(CHAVE_ARMAZENAMENTO);


    private readonly sessaoState = signal<SessaoAutenticada | null>(this.lerSessao());
    readonly sessao = this.sessaoState.asReadonly();

    cadastrar(req: CadastroRequest): Observable<UsuarioDto> {
        return this.http.post<UsuarioDto>(`${this.urlApi}/auth/cadastro`, req)
    }

    login(req: LoginRequest): Observable<TokenDto> {
        // Quando a API responde com sucesso, guarda o token e os dados do usuário antes de devolver a resposta à tela.
        return this.http.post<TokenDto>(`${this.urlApi}/auth/login`, req).pipe(
            tap(token => this.salvarSessao(token)));
    }

    // Transforma o erro HTTP da API em texto para a tela; a mensagem padrão cobre respostas sem formato conhecido.
    mensagemErro(error: unknown, mensagemPadrao: string): string {
        // Confirma que o erro veio de uma requisição HTTP; outros tipos usam a mensagem padrão.
        if (!(error instanceof HttpErrorResponse)) {
            return mensagemPadrao;
        }

        // O corpo da resposta HTTP pode conter os detalhes do erro enviado pela API.
        const resposta: unknown = error.error;
        // Só tenta ler propriedades se o corpo for um objeto.
        if (resposta === null || typeof resposta !== 'object') {
            return mensagemPadrao;
        }

        // Os campos são opcionais porque o formato da resposta varia conforme o tipo de erro.
        const problema = resposta as {
            detail?: unknown;
            title?: unknown;
            errors?: unknown;
        };

        // Erros de autenticação geralmente trazem o motivo em "detail".
        if (typeof problema.detail === 'string') {
            return problema.detail;
        }

        // Erros de validação podem agrupar várias mensagens dentro de "errors".
        if (problema.errors !== null && typeof problema.errors === 'object') {
            for (const mensagens of Object.values(problema.errors)) {
                // Cada campo pode ter uma lista de mensagens; usa a primeira que for texto.
                if (Array.isArray(mensagens)) {
                    const mensagem = mensagens.find(
                        (item): item is string => typeof item === 'string'
                    );
                    if (mensagem) {
                        return mensagem;
                    }
                }
            }
        }

        // Se a API não fornecer detalhes, usa o título ou a mensagem padrão da tela.
        return typeof problema.title === 'string' ? problema.title : mensagemPadrao;
    }

    private salvarSessao(token: TokenDto): void {
        // O token já contém os dados do usuário; mapeio para UsuarioDto, usado pelo restante da aplicação.
        const usuario: UsuarioDto = {
            id: token.usuarioId,
            nome: token.nome,
            email: token.email
        };

        // Agrupo token e usuário para que a tela inicial consiga exibir quem está autenticado.
        const sessao: SessaoAutenticada = {
            token,
            usuario
        };

        // Atualizar o signal notifica automaticamente os componentes que acompanham a sessão.
        localStorage.setItem(this.chaveArmazenamento, JSON.stringify(sessao))
        this.sessaoState.set(sessao);
    }

    private lerSessao(): SessaoAutenticada | null {
        try{
            const dadosArmazenados = localStorage.getItem(this.chaveArmazenamento);

            if (!dadosArmazenados) return null;

            const sessaoAnterior = JSON.parse(dadosArmazenados) as SessaoPersistidaAnteriormente

            const token = sessaoAnterior.token;
            const usuario = sessaoAnterior.usuario;

            if (!token || !usuario) {
                localStorage.removeItem(this.chaveArmazenamento);
                return null;
            }

            const expiracao = new Date(token.dataExpiracaoEmUtc).getTime();

            if (!token.accessToken || !usuario.email || Number.isFinite(expiracao) || expiracao <= Date.now()) {
                localStorage.removeItem(this.chaveArmazenamento);
                return null;          
            }

            const sessao: SessaoAutenticada = { token, usuario };

            if (!sessaoAnterior.usuario) {
                localStorage.setItem(this.chaveArmazenamento, JSON.stringify(sessao))
            }

            return sessao;

        } catch {
            localStorage.removeItem(this.chaveArmazenamento);
            return null;
        }
    }

    encerrarSessao(): void {
        localStorage.removeItem(this.chaveArmazenamento)
        this.sessaoState.set(null);

        void this.router.navigateByUrl('/')
    }

    
}
