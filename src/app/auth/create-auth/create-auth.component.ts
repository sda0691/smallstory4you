import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-auth',
  templateUrl: './create-auth.component.html',
  styleUrls: ['./create-auth.component.scss'],
})
export class CreateAuthComponent implements OnInit {
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}
 

  onSignup(email: string, password: string, name: string) {
    this.isLoading = true;
    this.loadingCtrl.create({message: 'Logging In...'})
      .then(loadingEl => {
        loadingEl.present();
        this.authService.signup(email, password, name)
        .then(result => {
            loadingEl.dismiss();
            this.isLoading = false;
            this.modalCtrl.dismiss(null, 'signup-success');
            this.router.navigateByUrl('/main/tabs/news');
        })
        .catch (error => {
          loadingEl.dismiss();
          this.authService.logout();
          const code = error.code;
          let message = error.message;
/*             if (
            code === 'auth/email-already-in-use' ||
            code === 'auth/invalid-email' ||
            code === 'auth/operation-not-allowed' ||
            code === 'Thrown if the password is not strong enoug') {
            message = 'Email and password is not correct.';
          } else {
            message = error.message;
          } */
          this.showAlert(message);
        });
      });
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  onFormSubmit(form: NgForm) {
    if (!form.value) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;

    this.onSignup(email, password, name);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
