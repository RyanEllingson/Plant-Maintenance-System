import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOtherPasswordComponent } from './change-other-password.component';

describe('ChangeOtherPasswordComponent', () => {
  let component: ChangeOtherPasswordComponent;
  let fixture: ComponentFixture<ChangeOtherPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeOtherPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOtherPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
