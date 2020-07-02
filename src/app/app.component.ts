import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { Subscription, of } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;
  isUserAuthenticated = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private modelCtrl: ModalController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    /* this.authService.userIsAuthenticatedObser.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      })
    ).subscribe(resData => {
      this.isUserAuthenticated = resData; 
    }); */
  }

  ionViewWillEnter() {
    /* this.authService.userIsAuthenticatedObser.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      })
    ).subscribe(resData => {
      this.isUserAuthenticated = resData; 
    }); */
  }

  onLogout() {
/*     this.authService.logout();
    this.isUserAuthenticated = false; */

    // this.router.navigateByUrl('/auth');
  }

  onLogin() {
    /* this.modelCtrl.create({
      component: AuthComponent,
      componentProps: {},
      id: 'test'
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss().then(resData => {
        console.log(resData);
        if
          ((resData.role === 'login-success') || 
          (resData.role === 'signup-success')) {
          this.isUserAuthenticated = true;
        }
        // this.isUserAuthenticated = true;
        this.router.navigate(['/main/tabs/news']);
      });
    }); */
  }

  ngOnDestroy() {
/*     if (this.authSub) {
      this.authSub.unsubscribe();
    } */
  }
}
