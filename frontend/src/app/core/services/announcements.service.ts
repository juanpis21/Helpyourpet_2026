import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Announcement {
  id: number;
  titulo: string;
  mensaje: string;
  fechaExpiracion: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDto {
  titulo: string;
  mensaje: string;
  fechaExpiracion?: string;
  isActive?: boolean;
}

export interface UpdateAnnouncementDto {
  titulo?: string;
  mensaje?: string;
  fechaExpiracion?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsService {
  private apiUrl = 'http://localhost:3000/announcements';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  create(announcement: CreateAnnouncementDto): Observable<Announcement> {
    return this.http.post<Announcement>(this.apiUrl, announcement, { headers: this.getAuthHeaders() });
  }

  getAll(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getActive(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/active`, { headers: this.getAuthHeaders() });
  }

  getById(id: number): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  update(id: number, announcement: UpdateAnnouncementDto): Observable<Announcement> {
    return this.http.patch<Announcement>(`${this.apiUrl}/${id}`, announcement, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
