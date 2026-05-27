import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Simple global error handling logic
        if (error.status === 401) {
          // Unauthorized – redirect to login
          this.router.navigate(['/auth/login']);
        } else if (error.status >= 500) {
          console.error('⚠️ Server error:', error);
        } else {
          console.warn('⚠️ HTTP error:', error.message);
        }
        return throwError(() => error);
      })
    );
  }
}
