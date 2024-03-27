import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private route: Router) { }

  canActivate(next: ActivatedRouteSnapshot): boolean {

    const role = next.data['role'];
    
    if (this.loginService.isAuthenticated()) {
      if (localStorage.getItem('role') == role) {
        return true;
      }
      return false;
    } else {
      this.route.navigate(['/login']);
      return false;
    }
  }

}
