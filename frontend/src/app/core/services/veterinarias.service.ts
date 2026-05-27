import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Veterinaria {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  rut: string;
  descripcion?: string;
  isActive: boolean;
  adminId?: number;
  admin?: any;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VeterinariasService {
  private apiUrl = `${environment.apiUrl}/veterinarias`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Veterinaria[]> {
    return this.http.get<Veterinaria[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getOne(id: number): Observable<Veterinaria> {
    return this.http.get<Veterinaria>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(veterinaria: Partial<Veterinaria>): Observable<Veterinaria> {
    return this.http.post<Veterinaria>(this.apiUrl, veterinaria, { headers: this.getAuthHeaders() });
  }

  update(id: number, veterinaria: Partial<Veterinaria>): Observable<Veterinaria> {
    return this.http.patch<Veterinaria>(`${this.apiUrl}/${id}`, veterinaria, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getByAdminId(adminId: number): Observable<Veterinaria | null> {
    return this.http.get<Veterinaria | null>(`${this.apiUrl}/by-admin/${adminId}`, { headers: this.getAuthHeaders() });
  }
}
