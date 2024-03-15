import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loginService.loggedin(true, response.token);
        this.loginService.getUser();
        this.loginService.getuserEmail()
        this.router.navigate(['header/home'])
      },
      error: (error) => {
        Swal.fire('Oops...', 'Something went wrong!, Please check your credentials', 'error');
      }
    }
    )

  }
}
