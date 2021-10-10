import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [NavbarComponent, InputComponent, ToastComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [NavbarComponent, InputComponent, ToastComponent],
})
export class SharedModule {}
