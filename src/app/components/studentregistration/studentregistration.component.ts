import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { RegisterService } from 'src/app/services/register.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-studentregistration',
  templateUrl: './studentregistration.component.html',
  styleUrls: ['./studentregistration.component.scss']
})
export class StudentregistrationComponent {

  subscription$: Subscription = new Subscription();

  profile!: File;
  aadhar!: File;
  income!: File;
  fee!: File;
  idcard!: File;
  today: Date = new Date();

  firstName: string = '';
  lastName: string = '';
  email: string = '';

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
    private loginService: LoginService,
    private userService: UserService,
    private studentService: StudentService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit() {

    this.subscription$.add(this.loginService.getuserEmail().subscribe({
      next: (email) => {
        this.subscription$.add(this.userService.getUser().subscribe({
          next: response => {
            this.email = response.email;
            this.firstName = response.firstName;
            this.lastName = response.lastName;
          }
        })
        )
      }
    })
    )
    this.personalDetailsForm = this.formBuilder.group({
      firstName: [{ value: this.firstName, disabled: true }, Validators.required],
      lastName: [{ value: this.lastName, disabled: true }, Validators.required],
      email: [{ value: this.email, disabled: true }, [Validators.required, Validators.email]],
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
      // this.fileValidation(this.profile, 'PROFILE');
    }
  }

  setAadhar(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.aadhar = fileInput.files[0];

      // this.fileValidation(this.aadhar, 'AADHAR');
    }
  }

  setIncome(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.income = fileInput.files[0];
      // this.fileValidation(this.income, 'INCOME');
    }
  }

  setIdcard(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.idcard = fileInput.files[0];
      // this.fileValidation(this.idcard, 'IDCARD');
    }
  }

  setFee(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.fee = fileInput.files[0];
      // this.fileValidation(this.fee, 'FEE');
    }
  }


  formdata: FormData = new FormData();

  mergeFormValues() {

    const applicationFormValues = {
      ...this.personalDetailsForm.value,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      dateOfBirth: this.personalDetailsForm.value.dateOfBirth.toISOString()
    };

    const academicFormValues = {
      ...this.academicForm.value,
      endDate: this.academicForm.value.endDate.toISOString()
    };



    const mergedFormValues = {
      ...applicationFormValues,
      ...academicFormValues,
      shortStory: this.proofsForm.value.shortStory
    };

    return mergedFormValues;
  }



  onSubmit() {

    if (this.aadhar === undefined || this.income === undefined || this.profile === undefined || this.fee === undefined || this.idcard === undefined) {
      Swal.fire('Warning', 'File not added', 'warning');
      return;
    }

    this.formdata = this.mergeFormValues();

    const formdata2: FormData = new FormData();

    formdata2.append('file1', this.profile);
    formdata2.append('file2', this.aadhar);
    formdata2.append('file3', this.income);
    formdata2.append('file4', this.idcard);
    formdata2.append('file5', this.fee);



    this.subscription$.add(this.studentService.save(this.formdata).subscribe(
      (response) => {
        this.subscription$.add(this.studentService.saveFiles(formdata2, this.email).subscribe({
          next: (value) => {
            Swal.fire('Registered Successfully', 'Your form is under Review, let you know once Confirmed', 'success');
            this.router.navigate(['/header/home']);
          }
        }))

      }
    ))
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
