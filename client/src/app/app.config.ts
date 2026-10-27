import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { Routes } from '@angular/router';
import { environment } from '../environments/environment.development';
import { URL_API } from './auth/auth.tokens';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home').then((c) => c.Home),
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then((c) => c.Login),
    },
    {
        path: 'cadastro',
        loadComponent: () => import('./auth/cadastro/cadastro').then((c) => c.Cadastro),
    },
    {
        path: '**',
        redirectTo: '',
    }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
        // Registra a URL da API para que os serviços possam recebê-la por injeção.
        provide: URL_API,
        // Usa o endereço definido para o ambiente importado neste arquivo.
        useValue: environment.urlApi
    },
  ]
};
