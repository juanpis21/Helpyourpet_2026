import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Ticket {
  id: number;
  asunto: string;
  descripcion: string;
  estado: 'Abierto' | 'En Proceso' | 'Cerrado';
  prioridad: 'Baja' | 'Media' | 'Alta';
  userId: number;
  user: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  asunto: string;
  descripcion: string;
  prioridad?: 'Baja' | 'Media' | 'Alta';
}

export interface UpdateTicketDto {
  estado?: 'Abierto' | 'En Proceso' | 'Cerrado';
  prioridad?: 'Baja' | 'Media' | 'Alta';
  asunto?: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private apiUrl = 'http://localhost:3000/tickets';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  create(ticket: CreateTicketDto): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket, { headers: this.getAuthHeaders() });
  }

  getAll(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/my-tickets`, { headers: this.getAuthHeaders() });
  }

  getById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  update(id: number, ticket: UpdateTicketDto): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}`, ticket, { headers: this.getAuthHeaders() });
  }

  updateStatus(id: number, estado: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}/status`, { estado }, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
