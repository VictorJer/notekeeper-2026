import { afterNextRender, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PaginaAutenticacao } from '../shell/pagina-autenticacao';
import { CadastroConcluidoNavigationState, LoginRequest } from '../auth.models';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { AuthService } from '../auth.service';
import { Token } from '@angular/compiler';

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

  protected readonly modelFormulario = signal<LoginFormModel>({ email: '', senha: '' });
  protected readonly formularioLogin = form(this.modelFormulario, (model) =>{
    required(model.email, { message: 'Informe seu email.'})
    email(model.email, { message: 'Informe um email valido.'});
    required(model.senha, { message: 'Informe sua senha.'});
    minLength(model.senha, 8, { message: 'A senha precisa conter 8 caracteres.'})
    pattern(model.senha, /(?=.*\d)(?=.*[a-zA-Z0-9]).+/, {message: 'Inclua pelo menos um número e um caractere especial.'});
  });

  constructor() {

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
    event.preventDefault();

    if (this.formularioLogin().invalid()) {
      this.formularioLogin().markAsTouched();
      return;
    }

    const requisicao: LoginRequest = {
      email: this.modelFormulario().email,
      senha: this.modelFormulario().senha,
    }

    this.authService.login(requisicao).subscribe(() => {
      void this.router.navigateByUrl('/')
    })
  }
}
