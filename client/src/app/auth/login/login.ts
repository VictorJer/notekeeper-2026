import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginaAutenticacao } from '../pagina-autenticacao';

@Component({
  imports: [PaginaAutenticacao, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {}
