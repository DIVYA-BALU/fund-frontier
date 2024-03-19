import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../findstudents/findstudents.component';

@Component({
  selector: 'app-storydialog',
  templateUrl: './storydialog.component.html',
  styleUrls: ['./storydialog.component.scss']
})
export class StorydialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
