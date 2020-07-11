import { Component, OnInit, OnDestroy } from '@angular/core';
import { LaunchNavigatorOptions, LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { GlobalConstants } from 'src/app/common/global-constants';


@Component({
  selector: 'app-church',
  templateUrl: './church.page.html',
  styleUrls: ['./church.page.scss'],
})
export class ChurchPage implements OnInit, OnDestroy {
  heroes = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado','kdfjdsjflksdfdkfjdfdf'];

  private subs: Subscription[] = [];
  loggedUser: User;
  churchName = GlobalConstants.churchName;
  churchAddress = GlobalConstants.churchAddress;
  test = 'ddfdf';
  constructor(
    private launchNavigator: LaunchNavigator,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));
  }
  ionViewWillEnter() {
    this.authService.getCurrentUser().subscribe(user => {
    });
  }
  onOpenMaps() {
    let options: LaunchNavigatorOptions = {
      start: null,  // current location
      // app: LaunchNavigator.APPS.UBER
    }
    this.launchNavigator.navigate("18 Haas Road, Toronto ON M9W 3A2", options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
