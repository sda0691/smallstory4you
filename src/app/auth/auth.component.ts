import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, ModalController, AlertController, ToastController } from '@ionic/angular';
import { CreateAuthComponent } from './create-auth/create-auth.component';
import { Observable } from 'rxjs';

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
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {}

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
                  message = 'Email and password is not correct.';
               } else {
                 message = error.message;
               }
            this.presentToast(message);
          }
        );
        /* authObs = this.authService.login(email, password);
        authObs.subscribe(
          resData => {
            console.log(resData);
            loadingEl.dismiss();
            this.isLoading = false;
            this.modalCtrl.dismiss(null, 'cancel');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            console.log(errRes);
            let message = 'Could not sign you up, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail address could not be found.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct.';
            }
            this.showAlert(message);
          }
        );  */
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
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
}
