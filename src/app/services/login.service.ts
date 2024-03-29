import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../model/login-response';
import { Register } from '../model/register';
import { User } from '../model/user';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginUrl = environment.loginUrl;
  userUrl = environment.userUrl;

  isLoggedin: boolean = false;

  loginStatus = new BehaviorSubject<boolean>(false);
  userRole = new BehaviorSubject<string>('');
  userEmail = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    if (localStorage.getItem('accessToken')) {
      this.getLoginStatus();
      this.getUser();
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password }
    return this.http.post<LoginResponse>(this.loginUrl, body);
  }

  loggedin(status: boolean, token: string): void {

    if (status) {
      this.isLoggedin = true;
      this.loginStatus.next(this.isLoggedin);
      localStorage.setItem("isloggedin", "true")
      localStorage.setItem("accessToken", token);
      this.getUser();
    } else {
      this.isLoggedin = false;
      localStorage.setItem('isLoggedin', 'false');
    }

  }


  getUser() {
    this.http.get<User>(this.userUrl).subscribe(
      (response) => {
        localStorage.setItem("role", response.role.role)
        this.userRole.next(response.role.role);
        this.userEmail.next(response.email);
      }
    );
  }

  getRole() {
    return this.userRole.asObservable();
  }

  getuserEmail() {     
    return this.userEmail.asObservable();
  }

  isAuthenticated(): boolean {
    return localStorage.getItem("isloggedin") === "true";
  }

  getLoginStatus() {
   this.loginStatus.next(this.isAuthenticated());
   
    return this.loginStatus.asObservable();
  }

  logout() {
    this.loginStatus.next(false);
    this.isLoggedin = false;
    localStorage.clear();
  }
}
