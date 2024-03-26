import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Funds } from 'src/app/model/funds';
import { Studentdetails } from 'src/app/model/studentdetails';
import { FundsService } from 'src/app/services/funds.service';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import { ViewstudentComponent } from '../viewstudent/viewstudent.component';
import { MatDialog } from '@angular/material/dialog';
import { Application } from 'src/app/model/application';

@Component({
  selector: 'app-fundedstudents',
  templateUrl: './fundedstudents.component.html',
  styleUrls: ['./fundedstudents.component.scss']
})
export class FundedstudentsComponent {

  subscription$: Subscription = new Subscription();
  amountRaised: number = 0;

  constructor(private loginService: LoginService,
    private studentService: StudentService,
    private fundsService: FundsService,
    private dialog: MatDialog) { }

  funds: Funds[] = [];
  students: Studentdetails[] = [];

  ngOnInit() {
    this.subscription$.add(this.loginService.getuserEmail().subscribe({
      next: response => {
        this.subscription$.add(this.fundsService.getStudentsByFunder(response).subscribe({
          next: data => {
            this.funds = data;
            this.funds.forEach((value) => {
              this.subscription$.add(this.studentService.findStudent(value.studentEmail).subscribe(
                (output) => {
                  this.addToStudents(output);
                }
              ))
            })
          }
        })
        )
      }
    }))
  }


  addToStudents(data: Studentdetails) {
    let details: Studentdetails = data;
    this.subscription$.add(this.studentService.getRaisedAmount(data.email.email).subscribe(
      (data) => {
        details.fundRaised = data.amount;
        details.raisedPercent = (data.amount / details.fundRequired) * 100;        
        details.raisedPercent = Math.round(details.raisedPercent * 100) / 100;
        
        this.students.push(details);
      }
    ))
  }

  viewStudent(student: Studentdetails) {
    const dialogRef = this.dialog.open(ViewstudentComponent, {
      height: '100%',
      data: {
        firstData: student,
        secondData: student.fundRequired - student.fundRaised
      } as DialogData,

    });

    dialogRef.afterClosed().subscribe()
  }

  calculateProgressValue(student: Application) {

    return (this.amountRaised / student.fundRequired) * 100;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}

export interface DialogData {
  firstData: Studentdetails;
  secondData: number;
}