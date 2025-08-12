import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CarritoService } from '../services/carrito.service';
import { Carrito } from '../models/carrito.model';

@Component({
  selector: 'app-carrito-boton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="carrito-boton" (click)="abrirCarrito()">
      <i class="fas fa-shopping-cart"></i>
      <span class="carrito-contador" *ngIf="carrito.cantidadItems > 0">
        {{ carrito.cantidadItems }}
      </span>
      <span class="carrito-texto">Carrito</span>
    </button>
  `,
  styles: [`
    .carrito-boton {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #ff6b35, #ffd700);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
      transition: all 0.3s ease;
      z-index: 100;
      min-width: 120px;
      justify-content: center;
    }

    .carrito-boton:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(255, 107, 53, 0.4);
      background: linear-gradient(45deg, #ffd700, #ff6b35);
    }

    .carrito-contador {
      background: #ff4757;
      color: white;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      position: absolute;
      top: -5px;
      right: -5px;
      animation: bounce 0.5s ease;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-5px);
      }
      60% {
        transform: translateY(-3px);
      }
    }

    .carrito-texto {
      margin-left: 4px;
    }

    @media (max-width: 768px) {
      .carrito-boton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        top: auto;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        padding: 0;
        min-width: auto;
      }
      
      .carrito-texto {
        display: none;
      }
      
      .carrito-boton i {
        font-size: 1.2rem;
      }
    }
  `]
})
export class CarritoBotonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  carrito: Carrito = { items: [], total: 0, cantidadItems: 0 };

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.carrito$
      .pipe(takeUntil(this.destroy$))
      .subscribe(carrito => {
        this.carrito = carrito;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  abrirCarrito(): void {
    this.carritoService.abrirCarrito();
  }
}
