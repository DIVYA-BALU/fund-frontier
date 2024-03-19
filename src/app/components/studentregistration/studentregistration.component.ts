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


  profile!: File;
  aadhar!: File;
  income!: File;
  fee!: File;
  idcard!: File;
  today: Date = new Date();

  @ViewChild('aadhar')
  aadharproof!: ElementRef;

  @ViewChild('income')
  incomeproof!: ElementRef;

  @ViewChild('studentid')
  idcardproof!: ElementRef;

  @ViewChild('fee')
  feeproof!: ElementRef;

  @ViewChild('profile')
  profileproof!: ElementRef;

  personalDetailsForm!: FormGroup;
  academicForm!: FormGroup;
  proofsForm!: FormGroup

  firstFormGroup = this.formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });


  constructor(
    private studentService: StudentService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit() {

    this.personalDetailsForm = this.formBuilder.group({
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
      zipCode: ['', Validators.required]
    });

    this.academicForm = this.formBuilder.group({
      school: ['', Validators.required],
      collegeName: ['', Validators.required],
      yearOfStudy: ['', Validators.required],
      course: ['', Validators.required],
      studentId: ['', Validators.required],
      fundRequired: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.proofsForm = this.formBuilder.group({
      aadharCardProof: [''],
      incomeProof: [''],
      studentIdentityProof: [''],
      feeDetails: [''],
      profilePhoto: [''],
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

  mergeFormValues() {

    const applicationFormValues = {
      ...this.personalDetailsForm.value,
      dateOfBirth: this.personalDetailsForm.value.dateOfBirth.toISOString()
    };

    const academicFormValues = {
      ...this.academicForm.value,
      endDate: this.academicForm.value.endDate.toISOString()
    };

    const proofsFormValues = {
      ...this.proofsForm.value
    };

    proofsFormValues['aadharCardProof'] = this.aadhar;
    proofsFormValues['incomeProof'] = this.income;
    proofsFormValues['feeDetails'] = this.fee;
    proofsFormValues['studentIdentityProof'] = this.idcard;
    proofsFormValues['profilePhoto'] = this.profile;

    const mergedFormValues = {
      ...applicationFormValues,
      ...academicFormValues,
      ...proofsFormValues
    };

    return mergedFormValues;
  }



  onSubmit() {

    this.formdata = this.mergeFormValues();

    if (this.aadhar === undefined || this.income === undefined || this.profile === undefined || this.fee === undefined || this.idcard === undefined) {
      Swal.fire('Warning', 'File not added', 'warning');
      return;
    }


    this.studentService.saveApplication(this.formdata).subscribe(
      (response) => {
        this.router.navigate(['/header/home'])
      }
    )
  }


  fileValidation(file: File, name: string) {

    const id = this.academicForm.value.studentId;

    if (file.name !== (`${id}-${name}.jpg` || `${id}-${name}.jpeg` || `${id}-${name}.png`)) {
      Swal.fire('Wrong format', `Should be your StudentID-${name}`, 'warning');

      switch (name) {
        case 'AADHAR':
          this.aadharproof.nativeElement.value = '';
          break;
        case 'INCOME':
          this.incomeproof.nativeElement.value = '';
          break;
        case 'PROFILE':
          this.profileproof.nativeElement.value = '';
          break;
        case 'IDCARD':
          this.idcardproof.nativeElement.value = '';
          break;
        case 'FEE':
          this.feeproof.nativeElement.value = '';
          break;
        default:
          break;
      }


    }

  }
}