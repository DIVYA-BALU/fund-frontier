import { Component } from '@angular/core';
import { Funder } from 'src/app/model/funder';
import { Studentdetails } from 'src/app/model/studentdetails';
import { FundersService } from 'src/app/services/funders.service';
import { FundsService } from 'src/app/services/funds.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-updatefunderprofile',
  templateUrl: './updatefunderprofile.component.html',
  styleUrls: ['./updatefunderprofile.component.scss']
})
export class UpdatefunderprofileComponent {

  constructor(private fundersService: FundersService,
    private fundsService: FundsService,
    private studentService: StudentService,
  ) { }
  ngOnInit() {
    this.getFunder();
  }

  funder: Funder = {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryOfBirth: '',
    countryOfResidence: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    occupation: ''
  }


  getFunder() {
    this.fundersService.getFunder().subscribe(
      (response) => {
        this.funder = response
      }
    )
  }

  UpdateFunder() {
    this.fundersService.updateFunder(this.funder).subscribe(
      (data) => {
        this.funder = data;
      }
    )
  }

  students: Studentdetails[] = [];



}
