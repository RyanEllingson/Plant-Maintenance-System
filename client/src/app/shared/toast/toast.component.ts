import { Component, Input, OnInit } from '@angular/core';
import { Toast } from 'bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit {
  @Input() public containerId: string;
  public message: string;
  private toast: Toast;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const toastContainer = document.getElementById(this.containerId);
    this.toast = new Toast(toastContainer);
    this.toastService.toastMessage$.subscribe((message) => {
      this.message = message;
      this.toast.show();
    });
  }
}
