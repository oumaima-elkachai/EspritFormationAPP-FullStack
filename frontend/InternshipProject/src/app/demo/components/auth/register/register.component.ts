import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    roleType: 'CLIENT',
    apiKeys: [],
    defaultModel: 'gpt-4'
  };
  errorMessage: string = '';
  emailError: string = '';
  phoneError: string = '';
  agreeTerms: boolean = false;
  hidePassword: boolean = true;
  isLoading: boolean = false;
  isSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  checkEmail(): void {
    this.authService.checkEmailUnique(this.user.email).subscribe({
      next: (isUnique) => {
        this.emailError = isUnique ? '' : 'Email is already in use';
      }
    });
  }

  checkPhone(): void {
    if (this.user.phoneNumber) {
      this.authService.checkPhoneUnique(this.user.phoneNumber).subscribe({
        next: (isUnique) => {
          this.phoneError = isUnique ? '' : 'Phone number is already in use';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.emailError || this.phoneError || !this.agreeTerms) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isSuccess = true;
        
        // Show success message for 1.5 seconds before redirecting
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}