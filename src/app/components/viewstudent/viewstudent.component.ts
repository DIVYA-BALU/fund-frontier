import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Funds } from 'src/app/model/funds';
import { Studentdetails } from 'src/app/model/studentdetails';
import { FundsService } from 'src/app/services/funds.service';
import { LoginService } from 'src/app/services/login.service';
import { RegisterService } from 'src/app/services/register.service';
import { StudentService } from 'src/app/services/student.service';
import { DialogData } from '../findstudents/findstudents.component';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

declare var Razorpay: {
  open(options: RazorpayOptions): void;
};

@Component({
  selector: 'app-viewstudent',
  templateUrl: './viewstudent.component.html',
  styleUrls: ['./viewstudent.component.scss'],
})
export class ViewstudentComponent {

  subscription$: Subscription = new Subscription();

  value: number = 100;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<ViewstudentComponent>,
    private studentService: StudentService,
    private registerService: RegisterService,
    private loginService: LoginService,
    private router: Router,
    private fundsService: FundsService
  ) { }

  loginStatus: boolean = false;

  indivualStudent!: Studentdetails;

  funderEmail: string = '';

  student: Studentdetails = this.data.firstData;

  balanceAmount: number = this.data.secondData;

  role: string = '';

  funds: Funds = {
    funderEmail: '',
    studentEmail: '',
    date: new Date(),
    totalAmount: 0.00,
    studentAmount: 0.00,
    maintainenceAmount: 0.00

  };


  ngOnInit() {
    this.subscription$.add(this.studentService.viewStudent(this.student.email.email).subscribe((response) => {
      this.indivualStudent = response;
    }))
  }

  onNoClick() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }


  payment() {

    this.subscription$.add(this.loginService.getLoginStatus().subscribe(
      data => {
        this.loginStatus = data;
      }
    ))

    this.subscription$.add(this.loginService.getRole().subscribe(
      (data) => {
        this.role = data;

      }
    ))
    if (!this.loginStatus || this.role !== 'FUNDER') {
      this.dialogRef.close();
      this.router.navigate(['/header/register'])
    }
    else {
      this.subscription$.add(this.loginService.getuserEmail().subscribe(
        (data) => {
          this.funderEmail = data;
        }
      )
      )
      if (this.funderEmail !== '') {
        const amount: number = ((this.value * 100) + ((7.5 / 100) * this.value) * 100);

        const RazorpayOptions = {
          description: 'Sample Razorpay demo',
          currency: 'INR',
          amount: amount,
          key: 'rzp_test_dfaTwJvV84YGAu',
          theme: {
            color: '#092644'
          },
          handler: (response: RazorpayResponse) => {

            if (response.razorpay_payment_id) {

              this.funds.funderEmail = this.funderEmail;
              this.funds.studentEmail = this.student.email.email;
              this.funds.date = new Date();
              this.funds.totalAmount = this.value + (7.5 * this.value) / 100;
              this.funds.studentAmount = this.value;
              this.funds.maintainenceAmount = (7.5 * this.value) / 100;
              this.subscription$.add(this.fundsService.saveFund(this.funds).subscribe(
                (response) => {
                  this.dialogRef.close();
                }
              ));

            } else {
              Swal.fire('Sorry', 'Payment has Failed', 'error');
            }
          },
          modal: {
            ondismiss: () => {
            }
          }
        }

        Razorpay.open(RazorpayOptions)
      }
    }
  }

  validate() {
    return this.validateStep(this.value) || this.validateMax(this.value,this.balanceAmount) || this.validateMin(this.value);
  }

  validateStep(val: number): boolean {
    return val % 100 !== 0;
  }
  validateMax(val: number, max: number): boolean {
    return val > max;
  }
  validateMin(val: number): boolean {
    return val < 100;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
}


interface RazorpayOptions {
  description: string;
  currency: string;
  amount: number;
  key: string;
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}