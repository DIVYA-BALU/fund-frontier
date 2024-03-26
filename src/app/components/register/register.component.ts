import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterService } from 'src/app/services/register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  subscription$: Subscription = new Subscription();
  registerForm!: FormGroup;

  role: string = '';

  StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  constructor(
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.StrongPasswordRegx)]],
      role: ['', [Validators.required]]
    });

  }

  onSubmit() {

    this.subscription$.add(this.registerService.register(this.registerForm.value).subscribe(
      {
        next: (data) => {
          Swal.fire("Success!", "Registration successful!", "success").then(() => {
            if (this.registerForm.value.role === 'FUNDER')
              this.router.navigate(['header/login']);
            else
              this.router.navigate(['/header/studentregistration']);
          })
        },
        error: (respose) => {
          if (respose.status === 400) {
            Swal.fire("Error!", "Email already exist!", "error");
          }
        }
      }));
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
