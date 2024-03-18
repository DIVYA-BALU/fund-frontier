import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-studentregistration',
  templateUrl: './studentregistration.component.html',
  styleUrls: ['./studentregistration.component.scss']
})
export class StudentregistrationComponent {

  applicationForm!: FormGroup;

  id: string = '';
  profile!: File;
  aadhar!: File;
  income!: File;
  fee!: File;
  idcard!: File;

  @ViewChild('fileUpload', { static: false })
  fileUpload!: ElementRef;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }





  ngOnInit() {
    this.applicationForm = this.formBuilder.group({
      profilePhoto: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      countryOfBirth: ['', Validators.required],
      countryOfResidence: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      school: ['', Validators.required],
      aadharCardProof: ['', Validators.required],
      incomeProof: ['', Validators.required],
      collegeName: ['', Validators.required],
      yearOfStudy: ['', Validators.required],
      course: ['', Validators.required],
      studentIdentityProof: ['', Validators.required],
      studentId: ['', Validators.required],
      fundRequired: ['', Validators.required],
      feeDetails: ['', Validators.required],
      endDate: ['', Validators.required],
      shortStory: ['', Validators.required]
    });
  }

  setProfile(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.profile = fileInput.files[0];
      this.fileValidation(this.profile, 'PROFILE');
    }
  }

  setAadhar(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.aadhar = fileInput.files[0];
      this.fileValidation(this.aadhar, 'AADHAR');
    }
  }

  setIncome(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.income = fileInput.files[0];
      this.fileValidation(this.income, 'INCOME');
    }
  }

  setIdcard(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.idcard = fileInput.files[0];
      this.fileValidation(this.idcard, 'IDCARD');
    }
  }

  setFee(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.fee = fileInput.files[0];
      this.fileValidation(this.fee, 'FEE');
    }
  }


  formdata: FormData = new FormData();

  onSubmit() {

    this.formdata.append('profilePhoto', this.profile),
      this.formdata.append('firstName', this.applicationForm.value.firstName),
      this.formdata.append('lastName', this.applicationForm.controls['lastName'].value),
      this.formdata.append('email', this.applicationForm.controls['email'].value),
      this.formdata.append('phoneNumber', this.applicationForm.controls['phoneNumber'].value),
      this.formdata.append('gender', this.applicationForm.controls['gender'].value),
      this.formdata.append('countryOfBirth', this.applicationForm.value.countryOfBirth),
      this.formdata.append('countryOfResidence', this.applicationForm.controls['countryOfResidence'].value),
      this.formdata.append('dateOfBirth', this.applicationForm.controls['dateOfBirth'].value.toISOString()),
      this.formdata.append('address', this.applicationForm.controls['address'].value),
      this.formdata.append('city', this.applicationForm.controls['city'].value),
      this.formdata.append('state', this.applicationForm.controls['state'].value),
      this.formdata.append('zipCode', this.applicationForm.controls['zipCode'].value),
      this.formdata.append('school', this.applicationForm.controls['school'].value),
      this.formdata.append('aadharCardProof', this.aadhar),
      this.formdata.append('incomeProof', this.income),
      this.formdata.append('collegeName', this.applicationForm.controls['collegeName'].value),
      this.formdata.append('course', this.applicationForm.controls['course'].value),
      this.formdata.append('studentIdentityProof', this.idcard),
      this.formdata.append('studentId', this.applicationForm.controls['studentId'].value),
      this.formdata.append('fundRequired', this.applicationForm.controls['fundRequired'].value),
      this.formdata.append('feeDetails', this.fee),
      this.formdata.append('endDate', this.applicationForm.controls['endDate'].value.toISOString()),
      this.formdata.append('shortStory', this.applicationForm.controls['shortStory'].value);


    this.studentService.saveApplication(this.formdata).subscribe(
      (response) => {
        this.router.navigate(['/header/home'])
      }
    )
  }



  firstFormGroup = this.formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  fileValidation(file: File, name: string) {

    if (file) {

      if (file.name !== (`${this.id}-${name}.jpg` || `${this.id}-${name}.jpeg` || `${this.id}-${name}.png`)) {
        Swal.fire('Wrong format', `Should be your StudentID-${name}`, 'warning');
        if (this.fileUpload && this.fileUpload.nativeElement) {
          const input = this.fileUpload.nativeElement as HTMLInputElement;
          input.value = '';
        }
      }
    }
  }

}
