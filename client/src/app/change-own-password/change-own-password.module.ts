import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangeOwnPasswordRoutingModule } from './change-own-password-routing.module';
import { ChangeOwnPasswordComponent } from './change-own-password/change-own-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ChangeOwnPasswordComponent],
  imports: [
    CommonModule,
    ChangeOwnPasswordRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class ChangeOwnPasswordModule {}
