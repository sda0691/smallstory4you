import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

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
    private modalCtrl: ModalController) { }

  ngOnInit() {

  }



  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onLogout() {
   this.modalCtrl.dismiss(null, 'logout');
  }

  onResetPassword() {
    this.authService.resetPassword('junsoft2000@gmail.com');
    return;
    this.modalCtrl.create({
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
      // console.log(resultData.data, resultData.role);
    });
  }
}
