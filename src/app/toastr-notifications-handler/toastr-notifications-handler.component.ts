import { Component, OnInit, DoCheck, ViewContainerRef } from '@angular/core';
import { ToastrNotificationService } from './../services/toastr-notification.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-toastr-notifications-handler',
  templateUrl: './toastr-notifications-handler.component.html',
  styleUrls: ['./toastr-notifications-handler.component.scss']
})
export class ToastrNotificationsHandlerComponent implements OnInit, DoCheck {

  constructor(
    private toastr: ToastsManager,
    private vRef: ViewContainerRef,
    private toastrNotificationService: ToastrNotificationService) {

    this.toastr.setRootViewContainerRef(this.vRef);
  }

  ngOnInit() {
  }

  ngDoCheck() {
    while (this.toastrNotificationService.hasNotificationsInQueue) {
      const that = this;
      const nextToast = this.toastrNotificationService.nextNotificationInQueue;
      setTimeout(function () {
        that.toastr.setRootViewContainerRef(that.vRef);
        that.toastr[nextToast.method](nextToast.message, nextToast.heading);
      }, nextToast.delay);
    }
  }
}
