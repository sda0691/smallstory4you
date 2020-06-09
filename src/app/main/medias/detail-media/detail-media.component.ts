import { Component, OnInit, Input } from '@angular/core';
import { Media } from '../media.model';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { GlobalConstants } from 'src/app/common/global-constants';
import { EditMediaComponent } from '../edit-media/edit-media.component';
import { MdeiaService } from '../media.service';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-media',
  templateUrl: './detail-media.component.html',
  styleUrls: ['./detail-media.component.scss'],
})
export class DetailMediaComponent implements OnInit {
  @Input() selectedMedia: Media;
  audioUrl: string;
  isLoading = false;
  trustedVideoUrl: SafeResourceUrl;

  constructor(
    private modalCtrl: ModalController,
    private storage: AngularFireStorage,
    private alertCtrl: AlertController,
    private mediaService: MdeiaService,
    private router: Router,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const storageFolderName = GlobalConstants.mediaCollection + '/'; // 'Members/';
    const uploadedFileName = this.selectedMedia.fileName;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);

    fileRef.getDownloadURL()
    .subscribe(url => {
      this.audioUrl = url;
      console.log(url);
      this.isLoading = false;
    });

    this.youtubeSanitizer();
  }

  youtubeSanitizer(){

    const path = 'https://www.youtube.com/embed/UPUkbZk0nGA' ;
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(path);

  }
  openEdit(media: Media) {
    this.modalCtrl.dismiss();
    this.modalCtrl.create({
      component: EditMediaComponent,
      componentProps: {selectedMedia: media}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

  onDeleteMedia() {
    console.log('member media');
    this.alertCtrl.create({
      header: 'Warning',
      message: 'Are you sure to delete?',
      buttons: [{text: 'Okey',
        handler: () => {
          this.mediaService.delete_media(this.selectedMedia);
          this.modalCtrl.dismiss();
          this.router.navigate(['/main/tabs/medias']);
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
    // this.membersService.delete_student(this.selectedMember.id);

  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }


}
