import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  role: string = '';
  loggedin: boolean = false;
  isRegistered:boolean = false;
  constructor(private loginService: LoginService, private studentService: StudentService) {

  }

  ngOnInit() {
    this.loginService.getLoginStatus().subscribe(
      (data) => {
        this.loggedin = data;
      }
    )

    if (this.loggedin) {
      this.loginService.getRole().subscribe(
        (data) => {
          if(this.role === 'STUDENT') {
          this.loginService.getuserEmail().subscribe({
            next: response => {
              this.studentService.findStudent(response).subscribe({
                next: value =>{
                  if(value === null) {
                    this.role = '';
                  }
                  else {
                    this.role = data;
                  }
                }
              })
              
            }
          })
        } else {
          this.role = data;
        }
        }
      )
    }
  }

}
