import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';


@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrls: ['./studentprofile.component.scss'],
})
export class StudentprofileComponent {

  constructor(private loginService: LoginService, private studentService: StudentService) { }

  subscrption$: Subscription = new Subscription();

  role: string = ''

  ngOnInit() {
    this.subscrption$.add(this.loginService.getuserEmail().subscribe({
      next: response => {

        this.subscrption$.add(this.studentService.findStudent(response).subscribe({
          next: value => {
            if (value === null) {
              this.role = 'GUEST_STUDENT';

            }
            else {
              this.role = 'STUDENT';

            }
          }
        }))

      }
    }))
  }

}
