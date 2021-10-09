import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateUserRoutingModule } from './update-user-routing.module';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UpdateUserComponent],
  imports: [
    CommonModule,
    UpdateUserRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class UpdateUserModule {}
