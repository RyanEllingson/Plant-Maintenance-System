import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { PlannerHomeComponent } from './planner-home/planner-home.component';
import { MaintenanceHomeComponent } from './maintenance-home/maintenance-home.component';
import { OperationsHomeComponent } from './operations-home/operations-home.component';
import { EngineeringHomeComponent } from './engineering-home/engineering-home.component';

@NgModule({
  declarations: [HomeComponent, AdminHomeComponent, PlannerHomeComponent, MaintenanceHomeComponent, OperationsHomeComponent, EngineeringHomeComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
