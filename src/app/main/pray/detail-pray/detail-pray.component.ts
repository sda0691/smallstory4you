import { Component, OnInit, Input } from '@angular/core';
import { Pray } from '../Pray.model';
import { Member } from '../../members/member.model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertController, ModalController } from '@ionic/angular';
import { User } from 'src/app/auth/user.model';
import { EditPrayComponent } from '../edit-pray/edit-pray.component';
import { PrayService } from '../pray.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-pray',
  templateUrl: './detail-pray.component.html',
  styleUrls: ['./detail-pray.component.scss'],
})
export class DetailPrayComponent implements OnInit {
  @Input() selectedPray: Pray;
  @Input() loggedUser: User;
  audioUrl = '';
  isLoading = false;
  lenVerseOfPray = 'short';
  constructor(
    private storage: AngularFireStorage,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private prayService: PrayService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.selectedPray.verseOfPray.length > 150 && this.selectedPray.verseOfPray.length  < 300 ) {
      this.lenVerseOfPray = 'medium';
    } else if (this.selectedPray.verseOfPray.length >= 300) {
      this.lenVerseOfPray = 'large';
    }
    this.isLoading = true;
    const storageFolderName = GlobalConstants.prayCollection + '/'; 
    const uploadedFileName = this.selectedPray.fileName;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);

    fileRef.getDownloadURL()
    .subscribe(url => {
      this.audioUrl = url;
      this.isLoading = false;
      console.log(url);
    }, error => {
      this.showAlert(error.message);
    }) ;
  }

  openEdit(pray: Pray) {
    this.modalCtrl.dismiss();
    this.modalCtrl.create({
      component: EditPrayComponent,
      componentProps: {selectedPray: pray, loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

  onDeletePray() {
    this.alertCtrl.create({
      header: 'Warning',
      message: 'Are you sure to delete?',
      buttons: [{text: 'Okey',
        handler: () => {
          this.prayService.delete_pray(this.selectedPray);
          this.modalCtrl.dismiss();
          this.router.navigate(['/main/tabs/pray']);
        }
      },
      {
        text: 'No',
          handler: () => {
            console.log('Cancel clicked');
          }
      }
    ]
    }). then (alertEl => {
      alertEl.present();
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
