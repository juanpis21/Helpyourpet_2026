import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Module {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private apiUrl = 'http://localhost:3000/modules';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getModules(): Observable<Module[]> {
    return this.http.get<Module[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  assignModulesToRole(roleId: number, moduleNames: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign/${roleId}`, { moduleNames }, { headers: this.getAuthHeaders() });
  }

  seedModules(): Observable<any> {
    return this.http.post(`${this.apiUrl}/seed`, {}, { headers: this.getAuthHeaders() });
  }
}
