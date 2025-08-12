import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Categoria {
  id: number;
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = `${environment.apiUrl || 'http://localhost:8080/api/v1'}/categories`;

  constructor(private http: HttpClient) {}

  // Obtener solo categorías activas (para usuarios)
  getCategoriasActivas(): Observable<{message: string, data: Categoria[]}> {
    return this.http.get<{message: string, data: Categoria[]}>(`${this.apiUrl}/active`);
  }

  // Obtener categoría por ID
  getCategoriaById(id: number): Observable<{message: string, data: Categoria}> {
    return this.http.get<{message: string, data: Categoria}>(`${this.apiUrl}/${id}`);
  }
}
