import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  color: string;
  weight: number;
  description: string;
  foto?: string;
  ownerId: number;
  owner?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private apiUrl = 'http://localhost:3000/pets';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getByOwner(ownerId: number): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/owner/${ownerId}`, { headers: this.getAuthHeaders() });
  }

  create(formData: FormData): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, formData, { headers: this.getAuthHeaders() });
  }

  update(id: number, formData: FormData): Observable<Pet> {
    return this.http.patch<Pet>(`${this.apiUrl}/${id}`, formData, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
