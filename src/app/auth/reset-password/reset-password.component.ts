import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  churchName = GlobalConstants.churchName;
  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}

  onResetPassword(inputData) {
    const email = inputData.form.value.email;
    console.log(email);
    this.authService.resetPassword(email)
      .then(() => {
        this.showAlert('Email has been sent')
      })
      .catch(error => {
        this.showAlert(error.message);
      })
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  private showAlert(message: string) {
    this.alertCtrl.create({
      // header: 'Error',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

}
