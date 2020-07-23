import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, ModalController, AlertController, ToastController } from '@ionic/angular';
import { CreateAuthComponent } from './create-auth/create-auth.component';
import { Observable } from 'rxjs';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { GlobalConstants } from '../common/global-constants';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLoading = false;
  isLogin = true;
  passwordType = 'password';
  show_hide = 'show';
  churchName = GlobalConstants.churchName;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {

  }
  showPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.show_hide = this.show_hide === 'show' ? 'hide' : 'show';
  }
  onLogin(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl.create({message: 'Logging In...'})
      .then(loadingEl => {
        loadingEl.present();
        // let authObs: Observable<AuthResponseData>;
        this.authService.login(email, password)
        .then(result => {
            console.log(result);
            loadingEl.dismiss();
            this.isLoading = false;
            this.modalCtrl.dismiss(null, 'login-success');
          })
          .catch(error => {
            loadingEl.dismiss();
            this.isLoading = false;

            console.log(error.message);
            const code = error.code;
            let message = 'Could not sign you up, please try again.';
            // tslint:disable-next-line: curly
            if (code === 'auth/invalid-email' ||
               code === 'auth/user-disabled' ||
               code === 'auth/user-not-found' ||
               code === 'auth/wrong-password') {
                  message = '입력하신 정보가 정확하지 않습니다';
               } else {
                 message = error.message;
               }
            // use alert than toast
            // this.presentToast(message);
            this.showAlert(message);
          }
        );
        
      });
  }
  presentToast(message: string) {
  this.toastCtrl.create({
      message: message,
      duration: 5000,
      // position: 'middle',
      animated: true

    }).then(toastData => {
      toastData.present();
    });
  }

  onSignup() {
    this.modalCtrl.create({
      component: CreateAuthComponent,
      componentProps: {},
      id: 'signup'
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss().then(modalData => {
        this.modalCtrl.dismiss(null,modalData.role,'test');
      });
    })
    .then(resultData => {
      // console.log(resultData.data, resultData.role);
    });
  }

  onForgotPassword() {
    this.modalCtrl.create({
      component: ResetPasswordComponent,
      componentProps: {},
      id: 'forgotpassword'
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss().then(modalData => {
        this.modalCtrl.dismiss(null,modalData.role, 'forgotpassword');
      });
    })
    .then(resultData => {
      // console.log(resultData.data, resultData.role);
    });
  }


  onFormSubmit(form: NgForm) {
    if (!form.value) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.onLogin(email, password);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      // header: 'Authentication failed',
      message: message,
      buttons: ['확인']
    })
    .then(alertEl => alertEl.present());
  }
}
