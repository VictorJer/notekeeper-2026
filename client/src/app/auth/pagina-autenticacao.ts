import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    imports: [RouterLink],
    selector: 'app-pagina-autenticacao',
    templateUrl: './pagina-autenticacao.html',
})
export class PaginaAutenticacao {
  // Recebe o título da tela que está usando este componente, como "Entrar" ou "Crie sua conta".
  @Input() titulo = '';

  // Recebe o texto auxiliar exibido logo abaixo do título.
  @Input() descricao = '';
}
