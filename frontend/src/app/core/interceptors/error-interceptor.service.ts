import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Lógica de manejo de errores globales
        if (error.status === 401) {
          // No autorizado o Token expirado – limpiar sesión y redirigir al login
          const authService = this.injector.get(AuthService);
          authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status >= 500) {
          console.error('⚠️ Error en el servidor:', error);
        } else {
          console.warn('⚠️ Error HTTP:', error.message);
        }
        return throwError(() => error);
      })
    );
  }
}
