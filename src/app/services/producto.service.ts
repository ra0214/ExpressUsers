import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Producto, CategoriaProducto, FiltroProductos, CreateProducto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/v1/products'; // URL de tu API

  constructor(private http: HttpClient) { }

  // Obtener todos los productos desde la API
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      map(productos => productos.map(p => ({
        ...p,
        // Si no hay image_url o está vacía, usar imagen por defecto
        image_url: p.image_url && p.image_url.trim() !== '' ? p.image_url : 'assets/images/placeholder.jpg',
        disponible: p.disponible !== undefined ? p.disponible : true,
        fechaCreacion: p.fechaCreacion ? new Date(p.fechaCreacion) : new Date()
      }))),
      catchError(this.handleError)
    );
  }

  // Crear un nuevo producto
  createProducto(producto: CreateProducto): Observable<any> {
    return this.http.post(this.apiUrl, producto).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar un producto
  updateProducto(id: number, producto: CreateProducto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un producto
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Filtrar productos localmente (después de obtenerlos de la API)
  getProductosPorCategoria(categoria: CategoriaProducto): Observable<Producto[]> {
    return this.getProductos().pipe(
      map(productos => productos.filter(p => p.category === categoria))
    );
  }

  getProductoById(id: number): Observable<Producto | undefined> {
    return this.getProductos().pipe(
      map(productos => productos.find(p => p.id === id))
    );
  }

  filtrarProductos(filtros: FiltroProductos): Observable<Producto[]> {
    return this.getProductos().pipe(
      map(productos => {
        let productosFiltrados = [...productos];

        if (filtros.categoria) {
          productosFiltrados = productosFiltrados.filter(p => p.category === filtros.categoria);
        }

        if (filtros.precioMin !== undefined) {
          productosFiltrados = productosFiltrados.filter(p => p.price >= filtros.precioMin!);
        }

        if (filtros.precioMax !== undefined) {
          productosFiltrados = productosFiltrados.filter(p => p.price <= filtros.precioMax!);
        }

        if (filtros.busqueda) {
          const busqueda = filtros.busqueda.toLowerCase();
          productosFiltrados = productosFiltrados.filter(p => 
            p.name.toLowerCase().includes(busqueda) ||
            p.description.toLowerCase().includes(busqueda)
          );
        }

        return productosFiltrados;
      })
    );
  }

  getCategorias(): CategoriaProducto[] {
    return Object.values(CategoriaProducto);
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo salió mal; por favor intenta de nuevo más tarde.';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error ${error.status}: ${error.message}`;
      if (error.error && error.error.error) {
        errorMessage += ` - ${error.error.error}`;
      }
    }
    
    console.error('Error en ProductoService:', error);
    return throwError(errorMessage);
  }
}
