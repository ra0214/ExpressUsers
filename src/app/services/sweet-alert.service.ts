import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() {}

  // Alerta de éxito - acepta string o SweetAlertOptions
  success(titleOrOptions: string | SweetAlertOptions, text?: string, timer: number = 3000): Promise<SweetAlertResult> {
    if (typeof titleOrOptions === 'string') {
      return Swal.fire({
        title: titleOrOptions,
        text,
        icon: 'success',
        timer,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'success-toast'
        }
      });
    } else {
      return Swal.fire({
        icon: 'success',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'success-toast'
        },
        ...titleOrOptions
      });
    }
  }

  // Alerta de error - acepta string o SweetAlertOptions
  error(titleOrOptions: string | SweetAlertOptions, text?: string): Promise<SweetAlertResult> {
    if (typeof titleOrOptions === 'string') {
      return Swal.fire({
        title: titleOrOptions,
        text,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ff6b35',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'error-alert'
        }
      });
    } else {
      return Swal.fire({
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ff6b35',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'error-alert'
        },
        ...titleOrOptions
      });
    }
  }

  // Alerta de advertencia - acepta string o SweetAlertOptions
  warning(titleOrOptions: string | SweetAlertOptions, text?: string): Promise<SweetAlertResult> {
    if (typeof titleOrOptions === 'string') {
      return Swal.fire({
        title: titleOrOptions,
        text,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ffd700',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'warning-alert'
        }
      });
    } else {
      return Swal.fire({
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ffd700',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'warning-alert'
        },
        ...titleOrOptions
      });
    }
  }

  // Alerta de información - acepta string o SweetAlertOptions
  info(titleOrOptions: string | SweetAlertOptions, text?: string): Promise<SweetAlertResult> {
    if (typeof titleOrOptions === 'string') {
      return Swal.fire({
        title: titleOrOptions,
        text,
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#40e0d0',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'info-alert'
        }
      });
    } else {
      return Swal.fire({
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#40e0d0',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'info-alert'
        },
        ...titleOrOptions
      });
    }
  }

  // Confirmación - acepta SweetAlertOptions
  confirm(titleOrOptions: string | SweetAlertOptions, text?: string, confirmText: string = 'Sí, confirmar'): Promise<SweetAlertResult> {
    if (typeof titleOrOptions === 'string') {
      return Swal.fire({
        title: titleOrOptions,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ff6b35',
        cancelButtonColor: '#6c757d',
        confirmButtonText: confirmText,
        cancelButtonText: 'Cancelar',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'confirm-alert'
        },
        reverseButtons: true
      });
    } else {
      return Swal.fire({
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ff6b35',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        background: '#fff',
        color: '#333',
        customClass: {
          popup: 'confirm-alert'
        },
        reverseButtons: true,
        ...titleOrOptions
      });
    }
  }

  // Toast notification
  toast(options: SweetAlertOptions): Promise<SweetAlertResult> {
    return Swal.fire({
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#fff',
      color: '#333',
      customClass: {
        popup: 'success-toast'
      },
      didOpen: (toastElement) => {
        toastElement.addEventListener('mouseenter', Swal.stopTimer);
        toastElement.addEventListener('mouseleave', Swal.resumeTimer);
      },
      ...options
    });
  }

  // Alerta de carga/loading
  loading(titleOrOptions: string | SweetAlertOptions = 'Procesando...', text?: string): void {
    if (typeof titleOrOptions === 'string') {
      Swal.fire({
        title: titleOrOptions,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        background: '#fff',
        color: '#333',
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: 'loading-alert'
        }
      });
    } else {
      Swal.fire({
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        background: '#fff',
        color: '#333',
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: 'loading-alert'
        },
        ...titleOrOptions
      });
    }
  }

  // Cerrar alerta de carga
  closeLoading(): void {
    Swal.close();
  }

  // Toast personalizado para agregar al carrito
  addToCartToast(productName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: '¡Agregado al carrito!',
      text: `"${productName}" se ha agregado correctamente`,
      icon: 'success',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: 'linear-gradient(45deg, #25d366, #128c7e)',
      color: '#fff',
      customClass: {
        popup: 'cart-toast',
        title: 'cart-toast-title',
        htmlContainer: 'cart-toast-content'
      },
      didOpen: (toastElement) => {
        toastElement.addEventListener('mouseenter', Swal.stopTimer);
        toastElement.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
  }

  // Confirmación de pedido enviado
  orderSent(): Promise<SweetAlertResult> {
    return Swal.fire({
      title: '¡Pedido enviado!',
      text: 'Tu pedido ha sido enviado por WhatsApp. Te contactaremos pronto.',
      icon: 'success',
      confirmButtonText: '¡Genial!',
      confirmButtonColor: '#25d366',
      background: '#fff',
      color: '#333',
      customClass: {
        popup: 'order-success',
        confirmButton: 'whatsapp-button'
      },
      showClass: {
        popup: 'animate__animated animate__heartBeat'
      }
    });
  }

  // Alerta personalizada para formularios
  formValidation(message: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: 'Formulario incompleto',
      text: message,
      icon: 'warning',
      confirmButtonText: 'Revisar',
      confirmButtonColor: '#ffd700',
      background: '#fff',
      color: '#333',
      customClass: {
        popup: 'form-validation'
      }
    });
  }

  // Toast de éxito personalizable
  customSuccessToast(title: string, icon: string = '🎉'): Promise<SweetAlertResult> {
    return Swal.fire({
      title: `${icon} ${title}`,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: 'linear-gradient(45deg, #ff6b35, #ffd700)',
      color: '#fff',
      customClass: {
        popup: 'custom-success-toast'
      }
    });
  }

  // Cerrar alerta actual
  close(): void {
    Swal.close();
  }

  // Verificar si hay una alerta abierta
  isVisible(): boolean {
    return Swal.isVisible();
  }

  // Alerta personalizada
  custom(options: SweetAlertOptions): Promise<SweetAlertResult> {
    return Swal.fire(options);
  }
}
