import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOwnPasswordComponent } from './change-own-password.component';

describe('ChangeOwnPasswordComponent', () => {
  let component: ChangeOwnPasswordComponent;
  let fixture: ComponentFixture<ChangeOwnPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeOwnPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOwnPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
