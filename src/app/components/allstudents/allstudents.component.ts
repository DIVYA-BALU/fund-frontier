import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Studentdetails } from 'src/app/model/studentdetails';
import { StudentService } from 'src/app/services/student.service';
import { StorydialogComponent } from '../storydialog/storydialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-allstudents',
  templateUrl: './allstudents.component.html',
  styleUrls: ['./allstudents.component.scss']
})
export class AllstudentsComponent {

  subscription$: Subscription = new Subscription();

  studentdetails: Studentdetails[] = [];
  displayedColumns: string[] = [
    'profilePhoto',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'gender',
    'countryOfBirth',
    'countryOfResidence',
    'dateOfBirth',
    'address',
    'city',
    'state',
    'zipCode',
    'school',
    'aadharCardProof',
    'incomeProof',
    'collegeName',
    'yearOfStudy',
    'course',
    'studentIdentityProof',
    'studentId',
    'fundRequired',
    'feeDetails',
    'endDate',
    'shortStory'
  ]

  dataSource!: MatTableDataSource<Studentdetails>;

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(private studentService: StudentService, private cdref: ChangeDetectorRef, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.studentdetails)
  }

  ngAfterViewInit() {
    this.subscription$.add(this.paginator.page.subscribe(
      (data) => {
        this.getAllStudents(data.pageIndex, data.pageSize);
      }
    ))
    this.getAllStudents(0, 3);
    this.cdref.detectChanges();

  }

  nextPage(e: PageEvent) {

    this.getAllStudents(e.pageIndex, e.pageSize);
  }


  getAllStudents(pageIndex: number, pageSize: number) {
    this.subscription$.add(this.studentService.getAllStudents(pageIndex, pageSize).subscribe(
      (data) => {
        this.studentdetails = data.content;
        this.paginator.length = data.totalElements;
        this.paginator.pageIndex = data.number;
        this.paginator.pageSize = data.size;
        this.dataSource.data = this.studentdetails;
      }
    ))
  }

  openDialog(story: string) {
    this.dialog.open(StorydialogComponent, {
      data: story,
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}


