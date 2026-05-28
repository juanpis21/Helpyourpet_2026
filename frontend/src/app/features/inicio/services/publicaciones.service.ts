import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private apiUrl = 'http://localhost:3000/publicaciones';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todas las publicaciones
  getPublicaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener publicaciones por autor
  getPublicacionesPorAutor(autorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/autor/${autorId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener publicaciones de todos los veterinarios de una misma veterinaria
  getPublicacionesPorVeterinaria(veterinariaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/veterinaria/${veterinariaId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Crear una nueva publicación (soporta FormData para subida de imágenes)
  crearPublicacion(publicacion: any): Observable<any> {
    if (publicacion instanceof FormData) {
      return this.http.post<any>(this.apiUrl, publicacion, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.authService.getToken()}`
        })
      });
    }
    return this.http.post<any>(this.apiUrl, publicacion, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualizar una publicación
  actualizarPublicacion(id: number, publicacion: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, publicacion, {
      headers: this.getAuthHeaders()
    });
  }

  // Eliminar una publicación
  eliminarPublicacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Reportar una publicación
  reportarPublicacion(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reportar`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener publicaciones reportadas por veterinaria
  getReportadasPorVeterinaria(veterinariaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reportadas/veterinaria/${veterinariaId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Dar o quitar like a una publicación
  darLike(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/like`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Agregar un comentario a una publicación
  agregarComentario(id: number, contenido: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/comentarios`, { contenido }, {
      headers: this.getAuthHeaders()
    });
  }

  // Compartir una publicación
  compartirPublicacion(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/compartir`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
