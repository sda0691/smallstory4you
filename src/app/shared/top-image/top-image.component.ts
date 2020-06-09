import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { take, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';

import { AuthComponent } from '../../auth/auth.component';
import { Router } from '@angular/router';
import { MyinfoComponent } from 'src/app/auth/myinfo/myinfo.component';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-top-image',
  templateUrl: './top-image.component.html',
  styleUrls: ['./top-image.component.scss'],
})
export class TopImageComponent implements OnInit {
  @Input() isAuth: boolean;
  @Input() loggedUser: User;
  
  isLoading = false;


  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {}

  onLogin() {
    this.isLoading = true;
    this.modalCtrl.create({
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
          this.isAuth = true;
        } else {
          if (resData.role === 'logout') {
            this.isAuth = false;
          }
        }
        this.isLoading = false;
        // this.isUserAuthenticated = true;
        this.router.navigate(['/main/tabs/news']);
      });
    });
  }

  onMyInfo() {
    this.modalCtrl.create({
      component: MyinfoComponent,
      componentProps: {loggedUser: this.loggedUser},
      id: 'test'
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss().then(resData => {
        console.log(resData);
        if
          ((resData.role === 'login-success') || 
          (resData.role === 'signup-success')) {
          this.isAuth = true;
        } else {
          if (resData.role === 'logout') {
            this.isAuth = false;
            this.authService.logout();
          }
        }
        // this.isUserAuthenticated = true;
        // this.router.navigate(['/main/tabs/news']);
      });
    });    
/*     this.authService.logout();
    this.isAuth = false; */

    // this.router.navigateByUrl('/auth');
  }

/* 
  ionViewWillEnter() {
    this.authService.userIsAuthenticatedObser.pipe(
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
    });
  } */
}
