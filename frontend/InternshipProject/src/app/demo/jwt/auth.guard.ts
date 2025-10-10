import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const requiredRole = route.data['role'];

      if (decoded.roles && decoded.roles.includes(requiredRole)) {
        return true;
      } else {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } catch (err) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
