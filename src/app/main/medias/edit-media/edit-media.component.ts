import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, Platform, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Media } from '../media.model';
import { MdeiaService } from '../media.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common/global-constants';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.scss'],
})
export class EditMediaComponent implements OnInit, OnDestroy {
  @Input() selectedMedia: Media;
  @Input() loggedUser: User;
  
  usePicker = false;
  pickedFile: any;
  task: AngularFireUploadTask;
  selectedFile: string;
  uploadProgress = 0;
  newDate = '';
  private subs: Subscription[] = [];
  
  constructor(
    private platform: Platform,
    private mediaService: MdeiaService,
    private loadingCtrl: LoadingController,
    private storage: AngularFireStorage,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.selectedMedia.dateOfMedia !== undefined) {
      this.newDate = this.selectedMedia.dateOfMedia.toISOString();
    }
    
    if ((
      this.platform.is('mobile') &&
      !this.platform.is('hybrid') ||
      this.platform.is('desktop')
    )) {
      this.usePicker = true; // do not show any time
    }
  }
  // if user is not admin, return to previous page
  ionViewWillEnter() {
    if (this.loggedUser.role.toUpperCase() !== 'ADMIN') {
      this.modalCtrl.dismiss();
    }
  }
  onEditMedia(inputData) {
    if (
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'audio' &&
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'video'
        ) {
        console.error('unsupported file type :( ');
        return;
    }
    let uploadedFileName = '';
    const storageFolderName = GlobalConstants.mediaCollection + '/'; // 'Members/';
    if (this.pickedFile) {
      uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    } else {
      uploadedFileName = this.selectedMedia.fileName;
    }
    
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    const customMetadata = { app: 'Media Files' };
    // const oldFileName = member.fileName;

    this.loadingCtrl.create({message: 'Edting media...'})
    .then(loadingEl => {
      loadingEl.present();

      // update database
      let record = {};
      record['dateOfMedia'] = new Date( inputData.form.value.dateOfMedia);
      record['author'] = inputData.form.value.author;
      record['title'] = inputData.form.value.title;
      record['subTitle'] = inputData.form.value.subTitle;
      record['category'] = inputData.form.value.category;
      record['id'] = this.selectedMedia.id;
      record['youtubeLink'] = inputData.form.value.youtubeLink;

      this.mediaService.edit_media(record, uploadedFileName)
      .then(data => {


        if (this.pickedFile) {
          this.task = this.storage.upload( fullPath, this.pickedFile, {customMetadata});

          this.subs.push(this.task.percentageChanges().subscribe(change => {
            this.uploadProgress = change;
          }));

          this.task.then(async res => {
            const toast = await this.toastCtrl.create({
              duration: 3000,
              message: 'File upload finished!'
            });
            if (this.selectedMedia.fileName) {
              this.mediaService.delete_image(this.selectedMedia.fileName);
            }
            toast.present();
            loadingEl.dismiss();
            this.modalCtrl.dismiss(null, 'media-upload-success');

          }).catch(error => {
            loadingEl.dismiss();
            this.showAlert(error.message);
          });
        } else {
          loadingEl.dismiss();
          this.modalCtrl.dismiss(null, 'media-upload-success');
          // this.router.navigate(['/main/tabs/medias']);
        }

       })
      .catch(error => {
        this.showAlert(error.message);
      }); 
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

  onFileChosen(event: FileList) {
    // const pickedFile = (event.target as HTMLInputElement).files[0];
     this.pickedFile = event.item(0);
     console.log(this.pickedFile);
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }  
}
