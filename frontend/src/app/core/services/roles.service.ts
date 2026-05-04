import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  name: string;
  description: string;
  modules?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'http://localhost:3000/roles';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  create(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role, { headers: this.getAuthHeaders() });
  }

  update(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/${id}`, role, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
