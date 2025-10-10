import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { jwtDecode} from 'jwt-decode';
import { User } from '../models/user';


export interface JwtPayload {
  id: number;
  sub: string;
  role: string;
  exp: number;
  iat: number;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8089/tests/auth';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    localStorage.clear();
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, authRequest).pipe(
      catchError(this.handleError)
    );

  }


  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, null, { params: { email } }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', otp);
    formData.append('newPassword', newPassword);
    
    return this.http.post(`${this.apiUrl}/reset-password`, formData).pipe(
      catchError(this.handleError)
    );
}

  checkEmailUnique(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email/${email}`).pipe(
      catchError(this.handleError)
    );
  }

  checkPhoneUnique(phoneNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-phone/${phoneNumber}`).pipe(
      catchError(this.handleError)
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    const decoded: any = jwtDecode(token);
    localStorage.clear();
    localStorage.setItem('userId', decoded.id);
    localStorage.setItem('role', decoded.role);
  
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  getCurrentUser(): Observable<User> {
    const userId = this.getUserId();
    return this.http.get<User>(`http://localhost:8089/tests/user/getbyid/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(user: User): Observable<User> {
    const userId = this.getUserId();
    return this.http.put<User>(`http://localhost:8089/tests/user/getbyid/${userId}`, user).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
  getParticipantId(): number | null {
    const token = localStorage.getItem('jwt');
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.id;
    } catch (err) {
      console.error('Erreur lors du décodage du token :', err);
      return null;
    }
  }
}