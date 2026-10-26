import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginaAutenticacao } from '../pagina-autenticacao';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { CadastroRequest } from '../auth.models';

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

  enviarFormulario(event: SubmitEvent) {
    event.preventDefault();



    const request: CadastroRequest = {
      nome: this.modelFormulario().email,
      email: this.modelFormulario().email,
      senha: this.modelFormulario().senha,
    }

    // const valorFormulario = this.modelFormulario();
    // console.log(valorFormulario);
  }
}
