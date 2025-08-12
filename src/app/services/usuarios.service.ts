import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  estado: number;
  created_at: string;
}

export interface CreateUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface UpdateUsuarioRequest {
  nombre: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Obtener usuario por ID
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Crear nuevo usuario
  createUsuario(usuario: CreateUsuarioRequest): Observable<any> {
    return this.http.post(this.apiUrl, usuario, { headers: this.getHeaders() });
  }

  // Actualizar usuario
  updateUsuario(id: number, usuario: UpdateUsuarioRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario, { headers: this.getHeaders() });
  }

  // Eliminar usuario
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Cambiar estado del usuario
  toggleUsuarioStatus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/toggle-status`, {}, { headers: this.getHeaders() });
  }
}
