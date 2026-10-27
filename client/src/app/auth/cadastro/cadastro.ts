import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { PaginaAutenticacao } from '../shell/pagina-autenticacao';
import { CadastroConcluidoNavigationState, CadastroRequest } from '../auth.models';
import { AuthService } from '../auth.service';

interface CadastroFormModel{
  readonly nome: string;
  readonly email: string;
  readonly senha: string;
}

@Component({
  imports: [PaginaAutenticacao, RouterLink, FormField],
  selector: 'app-cadastro',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router);
  
  protected readonly modelFormulario = signal<CadastroFormModel>({ email: '', senha: '', nome: '' });
  protected readonly formularioCadastro = form(this.modelFormulario, (model) =>{
    required(model.nome, { message: 'Informe seu nome.'});
    minLength(model.nome, 3,{ message: 'O nome deve conter pelo menos 3 caracteres.'})
    required(model.email, { message: 'Informe seu email.'})
    email(model.email, { message: 'Informe um email valido.'});
    required(model.senha, { message: 'Informe sua senha.'});
    minLength(model.senha, 8, { message: 'A senha precisa conter 8 caracteres.'})
    pattern(model.senha, /(?=.*\d)(?=.*[a-zA-Z0-9]).+/, {message: 'Inclua pelo menos um número e um caractere especial.'});
  });

  protected enviarFormulario(event: SubmitEvent): void {
    event.preventDefault();

    if (this.formularioCadastro().invalid()) {
      this.formularioCadastro().markAsTouched();
      return;
    }

    const request: CadastroRequest = {
      nome: this.modelFormulario().nome,
      email: this.modelFormulario().email,
      senha: this.modelFormulario().senha,
    }

    this.authService.cadastrar(request).subscribe((usuario) => {
      const estadoNavegacao: CadastroConcluidoNavigationState = {
        emailCadastrado: usuario.email
      };

      void this.router.navigateByUrl('/login', { state: estadoNavegacao })
    });

    // const valorFormulario = this.modelFormulario();
    // console.log(valorFormulario);
  }
}
