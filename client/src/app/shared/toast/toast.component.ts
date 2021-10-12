import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Toast } from 'bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit {
  public message: string;
  private toast: Toast;

  constructor(private toastService: ToastService, private el: ElementRef) {}

  ngOnInit(): void {
    const toastContainer = this.el.nativeElement.childNodes[0].childNodes[0];
    this.toast = new Toast(toastContainer);
    this.toastService.toastMessage$.subscribe((message) => {
      this.message = message;
      this.toast.show();
    });
  }
}
