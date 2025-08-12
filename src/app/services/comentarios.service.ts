import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) { }

  // Obtener comentarios por producto
  getComentariosPorProducto(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/${productId}`);
  }

  // Obtener todos los comentarios
  getAllComentarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  // Agregar nuevo comentario
  agregarComentario(comentario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, comentario);
  }

  // Obtener estadísticas de comentarios
  getEstadisticasComentarios(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/${productId}/stats`);
  }
}
