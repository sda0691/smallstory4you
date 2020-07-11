import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { User } from '../user.model';
import { Subscription } from 'rxjs';

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
   this.authService.logout();
   this.modalCtrl.dismiss(null, 'logout');
   // this.router.navigate(['/', 'main', 'tabs', 'medias']);
  }

  onResetPassword() {
    if (this.loggedUser) {
      this.authService.resetPassword(this.loggedUser.email)
        .then(() => {
          this.showAlert('비밀번호를 변경하기 위한 이메일이 전송되었습니다.이메일을 확인하세요');
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
      // header: 'Error',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
}
