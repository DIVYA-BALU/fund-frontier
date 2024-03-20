import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscribable, Subscription } from 'rxjs';
import { Successstory } from 'src/app/model/successstory';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-storycreation',
  templateUrl: './storycreation.component.html',
  styleUrls: ['./storycreation.component.scss']
})
export class StorycreationComponent {

  subscription$: Subscription = new Subscription();
  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) { }

  storyForm!: FormGroup;
  

  email: string = '';

  ngOnInit() {
    this.subscription$.add(this.loginService.getuserEmail().subscribe(
      (data) => {
        this.email = data;        
      }
    ))
    this.storyForm = this.formBuilder.group(
      {
        email : ['',Validators.required],
        story : ['', Validators.required]
      }
    )
  }

  story: Successstory = {
    _id: '',
    email: '',
    story: '',
  };

  onSubmit() {
    this.storyForm.value.email = this.email;
    this.subscription$.add(this.studentService.addStory(this.storyForm.value).subscribe(
      (response) => {
        this.story = response;
      }
    ))
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
