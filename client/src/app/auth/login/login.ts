import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PaginaAutenticacao } from '../shell/pagina-autenticacao';
import { CadastroConcluidoNavigationState, LoginRequest } from '../auth.models';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { AuthService } from '../auth.service';

interface LoginFormModel{
  readonly email: string;
  readonly senha: string;
}

@Component({
  imports: [PaginaAutenticacao, FormField, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // O signal guarda os valores do formulário e permite que os campos reajam às alterações.
  protected readonly modelFormulario = signal<LoginFormModel>({ email: '', senha: '' });
  // null significa que ainda não há erro para mostrar na tela.
  protected readonly mensagemErro = signal<string | null>(null);

  // Impede o envio à API enquanto os campos não atenderem às regras básicas.
  protected readonly formularioLogin = form(this.modelFormulario, (model) =>{
    required(model.email, { message: 'Informe seu email.'})
    email(model.email, { message: 'Informe um email valido.'});
    required(model.senha, { message: 'Informe sua senha.'});
    minLength(model.senha, 8, { message: 'A senha precisa conter 8 caracteres.'})
    pattern(model.senha, /(?=.*\d)(?=.*[^a-zA-Z0-9]).+/, {message: 'Inclua pelo menos um número e um caractere especial.'});
  });

  constructor() {
    // O cadastro envia o e-mail pela navegação; assim a pessoa não precisa digitá-lo de novo.
    const estadoNavegacao = this.router.currentNavigation()?.extras
    .state as CadastroConcluidoNavigationState | undefined;

    if (estadoNavegacao?.emailCadastrado) {
      this.modelFormulario.update(original => ({
        email: estadoNavegacao?.emailCadastrado ?? '',
        senha: original.senha
      }))
    }
  }

  protected enviarFormulario(event: SubmitEvent): void {
    // Evita o envio HTML tradicional, que recarregaria a página.
    event.preventDefault();

    if (this.formularioLogin().invalid()) {
      // Exibe os erros de validação nos campos e interrompe o login antes da chamada HTTP.
      this.formularioLogin().markAsTouched();
      return;
    }

    // Monta o corpo no formato que o endpoint /auth/login espera receber.
    const requisicao: LoginRequest = {
      email: this.modelFormulario().email,
      senha: this.modelFormulario().senha,
    }

    // Remove o erro anterior antes de tentar autenticar novamente.
    this.mensagemErro.set(null);
    this.authService.login(requisicao).subscribe({
      next: () => {
        // Só chegamos aqui se a API autenticou; o AuthService já gravou a sessão, então podemos abrir a home.
        void this.router.navigateByUrl('/');
      },
      error: (error: unknown) => {
        // Se a API rejeitar as credenciais ou houver outro erro, fica no login e mostra o motivo.
        this.mensagemErro.set(
          this.authService.mensagemErro(error, 'Não foi possível entrar. Verifique seus dados e tente novamente.')
        );
      }
    })
  }
}
