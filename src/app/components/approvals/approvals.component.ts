import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Studentdetails } from 'src/app/model/studentdetails';
import { StudentService } from 'src/app/services/student.service';
import { StorydialogComponent } from '../storydialog/storydialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent {

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
    'shortStory',
    'approval'
  ]

  dataSource!: MatTableDataSource<Studentdetails>;

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(private studentService: StudentService, private cdref: ChangeDetectorRef, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.studentdetails)
  }

  ngAfterViewInit() {
    this.subscription$.add(this.paginator.page.subscribe(
      (data) => {
        this.getAllPending(data.pageIndex, data.pageSize);
      }
    ))
    this.getAllPending(0, 3);
    this.cdref.detectChanges();

  }

  nextPage(e: PageEvent) {
    this.getAllPending(e.pageIndex, e.pageSize);
  }


  getAllPending(pageIndex: number, pageSize: number) {
    this.subscription$.add(this.studentService.getAllPending(pageIndex, pageSize).subscribe({
      next: (data) => {
        this.studentdetails = data.content;
        this.paginator.length = data.totalElements;
        this.paginator.pageIndex = data.number;
        this.paginator.pageSize = data.size;
        this.dataSource.data = this.studentdetails;
      }
    }))
  }

  setApproved(name: string, student: Studentdetails) {
    this.subscription$.add(this.studentService.setApproved(name, student).subscribe({
      next: () => {
        this.getAllPending(0, 3);
      }
    }))
  }

  setRejected(student: Studentdetails) {
    this.subscription$.add(this.studentService.setRejected(student).subscribe(
      () => {
        this.getAllPending(0, 3);
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
