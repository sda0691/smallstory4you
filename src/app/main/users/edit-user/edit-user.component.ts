import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  @Input() selectedUser: User;
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  onUserRoleChange( event: any ) {
    console.log('Selected', event.detail.value);
    const role = event.detail.value;
    this.loadingCtrl.create({message: 'Updating User Role...'})
      .then(loadingEl => {
        loadingEl.present();
        this.authService.updateRole(this.selectedUser.id, role ).then(data => {
          loadingEl.dismiss();
          this.showAlert('Role has been updated');
        }).catch (error => {
          loadingEl.dismiss();
          this.showAlert(error.message);
        });
      });
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
