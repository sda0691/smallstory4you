import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { AngularFireUploadTask } from '@angular/fire/storage/task';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Observable } from 'rxjs';
import { AngularFireStorageReference } from '@angular/fire/storage/ref';
import { AngularFireStorage } from '@angular/fire/storage/';
import { Platform, LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';
import { PraiseService } from '../praise.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-create-praise',
  templateUrl: './create-praise.component.html',
  styleUrls: ['./create-praise.component.scss'],
})
export class CreatePraiseComponent implements OnInit {
  @Input() loggedUser: User;

  usePicker = false;
  task: AngularFireUploadTask;
  pickedFile: any;
  uploadedFileURL: Observable<string>;
  downloadUrl = '';

  constructor(
    private storage: AngularFireStorage,
    private platform: Platform,
    private praiseService: PraiseService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,    
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

  onAddPraise(inputData) {

    // permission check
    if (!this.loggedUser || this.loggedUser.role.toUpperCase() !== 'ADMIN') {
      this.alertCtrl.create({
        header: 'Warning',
        message: 'Please login to have write permission',
        buttons: [{text: 'Okey', handler: () => {
          // this.router.navigate(['/places/tabs/offers']);
        }}]
      }). then (alertEl => {
        alertEl.present();
      });
      return;
    }

    // prepare if there is upload file
    let fullPath = '';
    let fileRef: AngularFireStorageReference;
    let uploadedFileName = '';
    if (this.pickedFile) {
      uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
      const storageFolderName = GlobalConstants.praiseCollection + '/'; // 'Members/';
      fullPath = storageFolderName + uploadedFileName;
      fileRef = this.storage.ref(fullPath);
    }
    const customMetadata = { app: 'Praise Files' };
    this.loadingCtrl.create({message: 'Adding a new praise...'})
    .then(loadingEl => {
      loadingEl.present();
      if (this.pickedFile) {
        this.task = this.storage.upload( fullPath, this.pickedFile, {customMetadata});
        this.task.then(async res => {
          const toast = await this.toastCtrl.create({
            duration: 3000,
            message: 'File upload finished!'
          });
          this.uploadedFileURL = fileRef.getDownloadURL();
          this.uploadedFileURL.subscribe(resp => {
            this.downloadUrl = resp;

            this.praiseService.add_praise(inputData.form.value, uploadedFileName, this.downloadUrl)
            .subscribe(resData => {
              loadingEl.dismiss();
              inputData.reset();
              this.modalCtrl.dismiss(null, 'praise-upload-success');
              this.router.navigate(['/main/tabs/praise']);
              }, error  => {
                loadingEl.dismiss();
                this.showAlert(error.message);
            });
            toast.present();
          });
        }).catch (error => {
          this.showAlert(error.message);
        });
      } else {
        this.praiseService.add_praise(inputData.form.value, uploadedFileName, this.downloadUrl)
        .subscribe(resData => {
          loadingEl.dismiss();
          inputData.reset();
          this.modalCtrl.dismiss(null, 'praise-upload-success');
          this.router.navigate(['/main/tabs/praise']);
          }, error  => {
            loadingEl.dismiss();
            this.showAlert(error.message);
        });
      }
    });
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      // header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
  onFileChosen(event: FileList) {
    // const pickedFile = (event.target as HTMLInputElement).files[0];
     this.pickedFile = event.item(0);
     console.log(this.pickedFile);
   }
   onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
