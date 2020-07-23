import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, Platform, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common/global-constants';
import { PrayService } from '../pray.service';
import { IonicModule } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-create-pray',
  templateUrl: './create-pray.component.html',
  styleUrls: ['./create-pray.component.scss'],
})
export class CreatePrayComponent implements OnInit, OnDestroy {
  usePicker = false;
  task: AngularFireUploadTask;
  pickedFile: any;
  uploadProgress = 0;
  uploadedFileURL: Observable<string>;
  downloadUrl = '';
  private subs: Subscription[] = [];

  constructor(
    private platform: Platform,
    private prayService: PrayService,
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

  }

onAddPray(inputData) {
    if (!this.pickedFile) {
      this.showAlert('파일을 선택하세요');
      return;
    }
    if (
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'audio' &&
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'video'
        ) {
        console.error('unsupported file type :( ');
        return;
    }

    
    const storageFolderName = GlobalConstants.prayCollection + '/'; // 'Members/';
    const uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    const customMetadata = { app: 'Pray Files' };

    this.loadingCtrl.create({message: 'Adding a new Pray...'})
    .then(loadingEl => {
      loadingEl.present();
      this.task = this.storage.upload( fullPath, this.pickedFile, {customMetadata});

      this.subs.push(this.task.percentageChanges().subscribe(change => {
        this.uploadProgress = change;
      }));
      this.task.then(async res => {
        const toast = await this.toastCtrl.create({
          duration: 3000,
          message: 'File upload finished!'
        });

        this.uploadedFileURL = fileRef.getDownloadURL();
        this.subs.push(this.uploadedFileURL.subscribe(resp => {
          this.downloadUrl = resp;

          this.subs.push(this.prayService.add_pray(inputData.form.value, uploadedFileName, this.downloadUrl)
          .subscribe(() => {
            loadingEl.dismiss();
            inputData.reset();
            this.modalCtrl.dismiss(null, 'pray-upload-success');
          }
          , error => {
            loadingEl.dismiss();
            this.showAlert(error.message);
          }));

          toast.present();
        }));
      }).catch(error => {
        loadingEl.dismiss();
        this.showAlert(error.message);
      });
    });
  }
  onFileChosen(event: FileList) {
    // const pickedFile = (event.target as HTMLInputElement).files[0];
     this.pickedFile = event.item(0);
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

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }  
}
