import { email, readonly } from "@angular/forms/signals";

export interface CadastroRequest {
    readonly nome: string;
    readonly email: string;
    readonly senha: string;
}

export interface CadastroConcluidoNavigationState {
    readonly emailCadastrado?: string;
}

export interface UsuarioDto{
    readonly id: string;
    readonly nome: string;
    readonly email: string;
}

export interface LoginRequest {
    readonly email: string;
    readonly senha: string;
}

export interface TokenDto{
    readonly UsuarioId: string;
    readonly Nome: string;
    readonly Email: string;
    readonly AccessToken: string;
    readonly DataExpiracaoEmUtc: string
}
