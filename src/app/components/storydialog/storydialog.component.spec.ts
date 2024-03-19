import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorydialogComponent } from './storydialog.component';

describe('StorydialogComponent', () => {
  let component: StorydialogComponent;
  let fixture: ComponentFixture<StorydialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorydialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
