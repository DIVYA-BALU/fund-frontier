import { Component } from '@angular/core';
import { Subscribable, Subscription } from 'rxjs';
import { Studentdetails } from 'src/app/model/studentdetails';
import { User } from 'src/app/model/user';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-updatestudentprofile',
  templateUrl: './updatestudentprofile.component.html',
  styleUrls: ['./updatestudentprofile.component.scss']
})
export class UpdatestudentprofileComponent {

  subscription$: Subscription = new Subscription();
  buttonClick: boolean = false;
  updateStatus: string = '';
  email: string = '';
  student: Studentdetails = {
    _id: '',
    profilePhoto: null,
    firstName: '',
    lastName: '',
    email: {
      _id: '',
      firstName: '',
      lastName: '',
      email: '',
      role: {
        _id: '',
        role: ''
      }
    },
    phoneNumber: 0,
    gender: '',
    countryOfBirth: '',
    countryOfResidence: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: 0,
    school: '',
    aadharCardProof: null,
    incomeProof: null,
    collegeName: '',
    yearOfStudy: '',
    course: '',
    studentIdentityProof: null,
    studentId: '',
    fundRequired: 0,
    feeDetails: null,
    endDate: '',
    shortStory: '',
    status: '',
    reason: '',
    fundRaised: 0,
    raisedPercent: 0
  };

  constructor(private userService: UserService,
    private studentService: StudentService) {

  }


  getprofile() {
    this.subscription$.add(this.userService.getUser().subscribe(
      (data) => {
        this.email = data.email;
        this.subscription$.add(this.studentService.viewStudent(data.email).subscribe(
          (response) => {
            const details = response;
            this.subscription$.add(this.studentService.getRaisedAmount(data.email).subscribe(
              (data) => {
                details.fundRaised = data.amount;
                details.raisedPercent = (data.amount / details.fundRequired) * 100;
                this.student = details;
              }
            ))
            this.student = response;

          }
        ))
      }
    ))
  }

  ngOnInit() {
    this.getprofile();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    let file: File | null = null;
    if (fileInput.files) {
      file = fileInput.files[0];
    }

    if (file) {
      const modifiedFileName = `${this.student.studentId}-PROFILE`; 

      const fileExtension = file.name.split('.').pop(); 
      const modifiedFileNameWithExtension = `${modifiedFileName}.${fileExtension}`; 

      const modifiedFile = new File([file], modifiedFileNameWithExtension, { type: file.type });

      this.subscription$.add(this.studentService.updateProfile(modifiedFile, this.student.email.email).subscribe(
        (response) => {
          this.student = response;
        }
      ))
    }
  }


  openFileInput() {
    const fileInput = document.getElementById('fileinput') as HTMLInputElement;
    fileInput.click();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
