import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringHomeComponent } from './engineering-home.component';

describe('EngineeringHomeComponent', () => {
  let component: EngineeringHomeComponent;
  let fixture: ComponentFixture<EngineeringHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineeringHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
