import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
})
export class EditProfileDialogComponent implements OnInit {
  user: User;
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private authService: AuthService
  ) {
    // Create a copy of the user data to avoid modifying the original object directly
    this.user = { ...data };
  }

  ngOnInit(): void {}

  onSave(): void {
    this.authService.updateProfile(this.user).subscribe({
      next: (updatedUser) => {
        this.dialogRef.close(updatedUser);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update profile. Please try again.';
        console.error(err);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
