import 'rxjs/add/operator/switchMap';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ApiUrlsConfigService } from './../../services/api-urls-config.service';
import { Observable } from 'rxjs/Observable';
import { ToastrNotificationOptionsFactoryService } from './../../services/toastr-notification-options-factory.service';
import { ToastrNotificationService } from './../../services/toastr-notification.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-add-to-favorites',
  templateUrl: './add-to-favorites.component.html',
  styleUrls: ['./add-to-favorites.component.scss']
})
export class AddToFavoritesComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastrNotificationService: ToastrNotificationService,
    private toastrNotificationOptionsFactoryService: ToastrNotificationOptionsFactoryService, ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
        const itemListingId = params['id'];
        return this.userService.addItemToUserFavorites(itemListingId);
      })
      .subscribe((response) => {
        const method = 'success';
        const message = `Added a new item to favorites.`;
        const heading = 'Yay!';
        const toastrNotificationOptions = this.toastrNotificationOptionsFactoryService
          .createToastrNotificationOptions(method, message, heading);

        this.toastrNotificationService.enqueueNotification(toastrNotificationOptions);
      }, (err) => {
        const method = 'error';
        const message = 'Invalid item.';
        const heading = 'Oops!';
        const toastrNotificationOptions = this.toastrNotificationOptionsFactoryService
          .createToastrNotificationOptions(method, message, heading);

        this.toastrNotificationService.enqueueNotification(toastrNotificationOptions);
      }, () => {
        this.router.navigateByUrl('gallery');
      });
  }
}
