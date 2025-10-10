import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    roleType: '',
    apiKeys: [],
    defaultModel: ''

  };
  errorMessage: string = '';
  emailError: string = '';
  phoneError: string = '';
  hidePassword: boolean = true;
  agreeTerms: boolean = true; // par défaut true car déjà accepté lors de l’inscription
  isEditMode: boolean = false; // This will be replaced by the dialog logic

  constructor(
    private authService: AuthService, 
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
   this.authService.getCurrentUser().subscribe({
    next: (user: User) => {
      this.user = user;
    }
   })
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '500px',
      data: this.user,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user = result;
      }
    });
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
    if (this.emailError || this.phoneError) return;

    this.authService.updateProfile(this.user).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']); // ou tout autre page
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
      }
    });
  }
  // Fonction pour gérer le changement d'avatar
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // Fonction pour gérer le changement d'avatar
onAvatarChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.user.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

}
