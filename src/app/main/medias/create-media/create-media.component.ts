import { Component, OnInit, Input } from '@angular/core';
import { Platform, LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { MdeiaService } from '../media.service';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { GlobalConstants } from 'src/app/common/global-constants';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MediaCategory } from '../media-category.model';

@Component({
  selector: 'app-create-media',
  templateUrl: './create-media.component.html',
  styleUrls: ['./create-media.component.scss'],
})
export class CreateMediaComponent implements OnInit {
  @Input() loadedMediaCategory: MediaCategory;

  task: AngularFireUploadTask;
  pickedFile: any;
  selectedFile: string;
  usePicker = false;
  uploadProgress = 0;
  
  
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
    if ((
      this.platform.is('mobile') &&
      !this.platform.is('hybrid') ||
      this.platform.is('desktop')
    )) {
      this.usePicker = true; // do not show any time
    }
/*     this.authService.userIsAuthenticatedObser.subscribe(isAuth => {
      this.isAuth = isAuth;
    }); */
  }

  onAddMember(inputData) {
    if (!this.pickedFile) {
      this.showAlert('Please select audio file');
      return;
    }
    if (
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'audio' &&
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'video'
        ) {
        console.error('unsupported file type :( ');
        return;
    }

    const storageFolderName = GlobalConstants.mediaCollection + '/'; // 'Members/';
    const uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    const customMetadata = { app: 'Media Files' };
    // const oldFileName = member.fileName;

    
        

    this.loadingCtrl.create({message: 'Adding a new media...'})
    .then(loadingEl => {
      loadingEl.present();
      this.task = this.storage.upload( fullPath, this.pickedFile, {customMetadata});

      this.task.percentageChanges().subscribe(change => {
        this.uploadProgress = change;
      });
      this.task.then(async res => {
        const toast = await this.toastCtrl.create({
          duration: 3000,
          message: 'File upload finished!'
        });

        toast.present();

        this.mediaService.add_media(inputData.form.value, uploadedFileName)
        .subscribe(() => {
          loadingEl.dismiss();
          this.modalCtrl.dismiss(null, 'media-upload-success');
          this.router.navigate(['/main/tabs/medias']);
        }
        , error => {
          loadingEl.dismiss();
          this.showAlert(error.message);
        });

      }).catch(error => {
        loadingEl.dismiss();
        this.showAlert(error.message);
      });




/*       this.mediaService.uploadImage(  true, this.pickedFile )
      .subscribe(resp => {
        // inputData.form.reset();
        loadingEl.dismiss();
        console.log('upload successed');
        // this.router.navigate(['/main/tabs/members']);
      }, error => {
        loadingEl.dismiss();
        console.log(error);
      }); */

    });
  }
  onFileChosen(event: FileList) {
    // const pickedFile = (event.target as HTMLInputElement).files[0];
     this.pickedFile = event.item(0);
     console.log(this.pickedFile);
/*      const fr = new FileReader();
     fr.onload = () => {
       const dataUrl = fr.result.toString();
       this.selectedFile = dataUrl;
       // this.imagePick.emit(pickedFile);
     };
     fr.readAsDataURL (this.pickedFile); */
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
