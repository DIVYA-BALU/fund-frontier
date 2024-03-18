import { Component } from '@angular/core';
import { Funds } from 'src/app/model/funds';
import { FundsService } from 'src/app/services/funds.service';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-fundedstudents',
  templateUrl: './fundedstudents.component.html',
  styleUrls: ['./fundedstudents.component.scss']
})
export class FundedstudentsComponent {

  constructor(private loginService: LoginService,
    private studentService: StudentService,
    private fundsService: FundsService) { }

    funds: Funds[] = [] ;

    ngOnInit() {
      this.loginService.getuserEmail().subscribe({
        next: response => {
          this.fundsService.getStudentsByFunder(response).subscribe({
            next: data => {
              this.funds = data;              
            }
          })
          
        }
      })
    }
}
