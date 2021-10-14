import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangeOtherPasswordRoutingModule } from './change-other-password-routing.module';
import { ChangeOtherPasswordComponent } from './change-other-password/change-other-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ChangeOtherPasswordComponent],
  imports: [
    CommonModule,
    ChangeOtherPasswordRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class ChangeOtherPasswordModule {}
