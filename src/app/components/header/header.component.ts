import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  subscrption$: Subscription = new Subscription();

  role: string = '';
  loggedin: boolean = false;
  isRegistered:boolean = false;
  constructor(private loginService: LoginService, private studentService: StudentService, private router: Router) {

  }

  ngOnInit() {
    this.subscrption$.add(this.loginService.getLoginStatus().subscribe(
      (data) => {
        this.loggedin = data;
      }
    ))

    if (this.loggedin) {
      this.subscrption$.add(this.loginService.getRole().subscribe(
        (data) => {
          if(this.role === 'STUDENT') {
          this.subscrption$.add(this.loginService.getuserEmail().subscribe({
            next: response => {
              this.subscrption$.add(this.studentService.findStudent(response).subscribe({
                next: value =>{
                  if(value === null) {
                    this.role = '';
                  }
                  else {
                    this.role = data;
                  }
                }
              }))
              
            }
          }))
        } else {
          this.role = data;
        }
        }
      ))
    }
  }
  logout() {
    this.loginService.logout();
    this.router.navigate(['/header/home'])
  }
  ngOnDestroy() {
    this.subscrption$.unsubscribe();
  }

}
