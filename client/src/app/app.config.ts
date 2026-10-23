import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { Routes } from '@angular/router';

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
    provideRouter(routes)
  ]
};
