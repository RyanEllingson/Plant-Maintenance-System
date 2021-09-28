import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerHomeComponent } from './planner-home.component';

describe('PlannerHomeComponent', () => {
  let component: PlannerHomeComponent;
  let fixture: ComponentFixture<PlannerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannerHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
