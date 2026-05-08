import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './core/components/navbar/navbar';
import { Footer } from './core/components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  router = inject(Router);
  protected readonly title = signal('adso_3063267-angular');

  /** Rutas donde NO se muestra el navbar global */
  private readonly noNavbarRoutes = ['/', '/login', '/register', '/recovery', '/perfil-usuario', '/admin', '/super-admin', '/veterinario'];

  /** Rutas donde NO se muestra el footer global */
  private readonly noFooterRoutes = ['/', '/login', '/register', '/recovery', '/perfil-usuario', '/admin', '/super-admin', '/veterinario'];

  get showNavbar(): boolean {
    const url = this.router.url.split('?')[0];
    return !this.noNavbarRoutes.includes(url);
  }

  get showFooter(): boolean {
    const url = this.router.url.split('?')[0];
    return !this.noFooterRoutes.includes(url);
  }

  get showLayout(): boolean {
    return this.showNavbar;
  }
}