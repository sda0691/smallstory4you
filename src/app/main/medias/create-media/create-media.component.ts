import { Component, OnInit, Input } from '@angular/core';
import { Platform, LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { MdeiaService } from '../media.service';
import { AngularFireUploadTask, AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { GlobalConstants } from 'src/app/common/global-constants';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MediaCategory } from '../media-category.model';
import { Observable } from 'rxjs';

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
  uploadedFileURL: Observable<string>;
  downloadUrl = '';

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
/*     if (!this.pickedFile) {
      this.showAlert('파일을 선택하세요');
      return;
    } */
    if (
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'audio' &&
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'video'
        ) {
        console.error('unsupported file type :( ');
        return;
    }
    let fullPath = '';
    let fileRef: AngularFireStorageReference;
    let uploadedFileName = '';
    if (this.pickedFile) { 
      const storageFolderName = GlobalConstants.mediaCollection + '/'; // 'Members/';
      uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
      fullPath = storageFolderName + uploadedFileName;
      fileRef = this.storage.ref(fullPath);
    }
    const customMetadata = { app: 'Media Files' };
    this.loadingCtrl.create({message: 'Adding a new media...'})
    .then(loadingEl => {
      loadingEl.present();
      if (this.pickedFile) {
        this.task = this.storage.upload( fullPath, this.pickedFile, {customMetadata});

        this.task.percentageChanges().subscribe(change => {
          this.uploadProgress = change;
        });
        this.task.then(async res => {
          const toast = await this.toastCtrl.create({
            duration: 3000,
            message: 'File upload finished!'
          });
  
          this.uploadedFileURL = fileRef.getDownloadURL();
          this.uploadedFileURL.subscribe(resp => {
            this.downloadUrl = resp;
  
            this.mediaService.add_media(inputData.form.value, uploadedFileName)
            .subscribe(() => {
              loadingEl.dismiss();
              inputData.reset();
              this.modalCtrl.dismiss(null, 'media-upload-success');
              this.router.navigate(['/main/tabs/medias']);
            }
            , error => {
              loadingEl.dismiss();
              this.showAlert(error.message);
            });
            toast.present();
  
          });
        }).catch(error => {
          loadingEl.dismiss();
          this.showAlert(error.message);
        });
      } else {
        this.mediaService.add_media(inputData.form.value, uploadedFileName)
        .subscribe(() => {
          loadingEl.dismiss();
          inputData.reset();
          this.modalCtrl.dismiss(null, 'media-upload-success');
          this.router.navigate(['/main/tabs/medias']);
        }
        , error => {
          loadingEl.dismiss();
          this.showAlert(error.message);
        });
      }

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
      // header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
}
