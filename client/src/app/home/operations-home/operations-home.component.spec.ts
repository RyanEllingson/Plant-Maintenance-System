import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsHomeComponent } from './operations-home.component';

describe('OperationsHomeComponent', () => {
  let component: OperationsHomeComponent;
  let fixture: ComponentFixture<OperationsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
