import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  subscription$: Subscription = new Subscription();
  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router, private studentService: StudentService) { }

  onSubmit(): void {
    this.subscription$.add(this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loginService.loggedin(true, response.token);
        this.subscription$.add(this.loginService.getRole().subscribe({
          next: (value) => {
            
            if(value === 'STUDENT'){
              this.subscription$.add(this.studentService.findStudent(this.email).subscribe({
                next: value => {
                  if(value === null)
                    this.router.navigate(['header/home']);
                  else
                  this.router.navigate(['header/home']);
                }
              }))
            }
            else {
              
              this.router.navigate(['header/home']);
          }
            }
            
        }))
      },
      error: (error) => {
        Swal.fire('Oops...', 'Something went wrong!, Please check your credentials', 'error');
      }
    }
    ))

  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
