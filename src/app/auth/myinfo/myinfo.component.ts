import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { ResetPasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-myinfo',
  templateUrl: './myinfo.component.html',
  styleUrls: ['./myinfo.component.scss'],
})
export class MyinfoComponent implements OnInit {
  @Input() loggedUser: User;
  user: User;
  userSub: Subscription;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
    ) { }

  ngOnInit() {

  }



  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onLogout() {
   this.modalCtrl.dismiss(null, 'logout');
  }

  onResetPassword() {
    if (this.loggedUser) {
      this.authService.resetPassword(this.loggedUser.email)
        .then(() => {
          this.showAlert('Email has been sent');
        })
        .catch(error => {
          this.showAlert(error.message);
        })
    }


/*     this.modalCtrl.create({
      component: ResetPasswordComponent,
      componentProps: {},
      id: 'resetpassword'
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss().then(modalData => {
        this.modalCtrl.dismiss(null, modalData.role);
      });
    })
    .then(resultData => {
    }); */
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
}
