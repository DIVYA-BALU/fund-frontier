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
        console.log(data);
        
        this.loggedin = data;
      }
    ))

      this.subscrption$.add(this.loginService.getRole().subscribe(
        (data) => {
          console.log(data);
          
          if(data === 'STUDENT') {
          this.subscrption$.add(this.loginService.getuserEmail().subscribe({
            next: response => {
              console.log(response);
              
              this.subscrption$.add(this.studentService.findStudent(response).subscribe({
                next: value =>{
                  console.log(value);
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
          console.log(data);
          this.role = data;
        }
        }
      ))
  }
  logout() {
    this.loginService.logout();
    this.router.navigate(['/header/home'])
  }
  ngOnDestroy() {
    this.subscrption$.unsubscribe();
  }

}
