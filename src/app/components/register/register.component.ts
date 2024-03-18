import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  registerForm!: FormGroup;

  role: string = '';
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
      password: ['', Validators.required],
      role: [['FUNDER'], [Validators.required]]
    });

  }

  onSubmit() {

    this.registerService.register(this.registerForm.value).subscribe(
      {
        next: (data) => {
          Swal.fire("Success!", "Registration successful!", "success").then(() => {
            if(this.registerForm.value.role === 'FUNDER')
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
      });
  }



}
