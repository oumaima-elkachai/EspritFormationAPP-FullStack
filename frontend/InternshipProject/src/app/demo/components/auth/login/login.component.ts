import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { AuthRequest } from '../../../models/auth-request.model';
import { AuthResponse } from '../../../models/auth-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule, MatSlideToggleModule, MatDividerModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authRequest: AuthRequest = { email: '', password: '' };
  rememberMe: boolean = false;
  errorMessage: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;
  isSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles = Array.from({length: 100}, () => ({
      x: Math.random() * window.innerWidth,
      y: -10,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 60 + 200}, 100%, 50%)`
    }));
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.y += p.speed;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      
      if (particles.some(p => p.y < window.innerHeight)) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };
    
    animate();
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  onSubmit() {
    localStorage.clear(); 
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.authRequest).subscribe({
      next: (response: AuthResponse) => {
        this.authService.setToken(response.token);
        this.isSuccess = true;
        this.triggerConfetti();
        setTimeout(() => {
          this.router.navigate(['/user-profile']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}