import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application } from 'src/app/model/application';
import { StudentService } from 'src/app/services/student.service';
import { ViewstudentComponent } from '../viewstudent/viewstudent.component';
import { User } from 'src/app/model/user';
import { Studentdetails } from 'src/app/model/studentdetails';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-findstudents',
  templateUrl: './findstudents.component.html',
  styleUrls: ['./findstudents.component.scss']
})
export class FindstudentsComponent {

  subscription$: Subscription = new Subscription();

  year: string = '';
  course: string = '';
  college: string = '';
  amountRaised: number = 0;
  ypageNo: number = -1;
  gpageNo: number = -1;
  cpageNo: number = -1;

  constructor(private studentService: StudentService, private dialog: MatDialog) {

  }
  students: Studentdetails[] = [];
  pageNo: number = 0;
  totalPages: number = 0;

  ngOnInit() {
    this.getAllStudents(0, 3);
  }

  getStudentsByYear(pageNo: number = 0, pageSize: number = 3) {
    this.students = [];
    if (this.year) {
      console.log(this.year);
      
      this.subscription$.add(this.studentService.getStudentsByYear(pageNo, pageSize, this.year).subscribe(
        (response) => {

          this.totalPages = response.totalPages - 1;
          response.content.forEach(data => {
            this.addToStudents(data);
          })

        }
      ))
    }
  }

  getStudentsByCourse(pageNo: number = 0, pageSize: number = 3) {

    this.students = [];
    if (this.course) {
      this.subscription$.add(this.studentService.getStudentsByCourse(pageNo, pageSize, this.course).subscribe(
        (response) => {
          this.totalPages = response.totalPages - 1;
          response.content.forEach(data => {
            this.addToStudents(data);
          })
        }
      ))
    }
  }

  getStudentsByCollege(pageNo: number = 0, pageSize: number = 3) {
    this.students = [];
    if (this.college) {
      this.subscription$.add(this.studentService.getStudentsByCollege(pageNo, pageSize, this.college,).subscribe(
        (response) => {
          this.totalPages = response.totalPages - 1;
          response.content.forEach(data => {
            this.addToStudents(data);
          })
        }
      ))
    }
  }

  getAllStudents(pageNo: number, pageSize: number) {
    this.subscription$.add(this.studentService.getStudents(pageNo, pageSize).subscribe(
      (response) => {
        this.totalPages = response.totalPages - 1;
        response.content.forEach(
          data => {
            this.addToStudents(data);
          }
        )

      }
    ))
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

    this.subscription$.add(dialogRef.afterClosed().subscribe(
      (res) => {        
        this.getAllStudents(++this.pageNo,3);
      }
    )
    )
  }

  loadMore() {
    if(this.course !== ''){
      this.getStudentsByCourse(++this.gpageNo,3);
    }else if(this.year !== '') {
      this.getStudentsByYear(++this.ypageNo,3);
    }else if(this.college !== '') {
      this.getStudentsByCollege(++this.cpageNo,3);
    }else{
      this.getAllStudents(++this.pageNo, 3);
    }
    
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
