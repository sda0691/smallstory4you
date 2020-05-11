import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
// import { CreateAuthComponent } from './create-auth/create-auth.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  onLogin() {
    this.loadingCtrl.create({message: 'Logging In...'})
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          this.authService.login();
          // this.router.navigateByUrl('/main/tabs/news');
          loadingEl.dismiss();
          this.modalCtrl.dismiss(null, 'cancel');
        }, 1000);
      });
  }
  onSignup() {   
    /* this.modalCtrl.create({
      component: CreateAuthComponent,
      componentProps: {}   
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      // console.log(resultData.data, resultData.role);
    }); */
  }
  onFormSubmit() {

  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
