import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule], // 💡 Obligatorio para formularios reactivos
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Formulario principal
  public loginForm: FormGroup;
  
  // Estados dinámicos de la interfaz
  public isRecoveryMode = false;
  public errorMessage = '';
  public successMessage = '';
  public isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['brandon.martinez@tapterminal.com', [Validators.required, Validators.email]],
      password: ['admin123', [Validators.required, Validators.minLength(6)]]
    });
  }

onSubmit(): void {
  if (this.loginForm.invalid && !this.isRecoveryMode) return;
  
  this.errorMessage = '';
  this.successMessage = '';
  this.isLoading = true;

  const { username, password } = this.loginForm.value;

  if (this.isRecoveryMode) {
    // Modo Recuperación (Gmail)
    this.authService.forgotPassword(username).subscribe({
      next: () => {
        this.successMessage = 'Se ha enviado un enlace de recuperación a tu correo.';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al enviar el correo.';
        this.isLoading = false;
      }
    });
  } else {
    // 🔐 Modo Login Directo
    this.authService.login({ username, password }).subscribe({
      next: (response) => {
        console.log('Login exitoso. Respuesta completa:', response);
        
        // 💡 JUGADA DE CONFIGURACIÓN DIRECTA: 
        // Navegamos usando la respuesta directa del Observer, ignorando el retraso de la Signal
        this.router.navigate(['/products']).then((navigated) => {
          if (!navigated) {
            console.error('El enrutador rechazó ir a /products. Posible bloqueo en el AuthGuard.');
            this.errorMessage = 'Acceso denegado: Revisa los permisos asignados a tu perfil.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error detectado en la petición HTTP:', err);
        this.errorMessage = err.error?.message || 'Credenciales inválidas o error de conexión.';
        this.isLoading = false;
      }
    });
  }
}

  toggleMode(): void {
    this.isRecoveryMode = !this.isRecoveryMode;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.isRecoveryMode) {
      this.loginForm.get('password')?.clearValidators();
    } else {
      this.loginForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.loginForm.get('password')?.updateValueAndValidity();
  }
}