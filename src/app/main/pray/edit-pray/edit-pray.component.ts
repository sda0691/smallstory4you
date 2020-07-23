import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Media } from '../../medias/media.model';
import { User } from 'src/app/auth/user.model';
import { AngularFireUploadTask } from '@angular/fire/storage/task';
import { Platform, LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { PrayService } from '../pray.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Pray } from '../Pray.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-pray',
  templateUrl: './edit-pray.component.html',
  styleUrls: ['./edit-pray.component.scss'],
})
export class EditPrayComponent implements OnInit, OnDestroy {
  @Input() selectedPray: Pray;
  @Input() loggedUser: User;
  
  usePicker = false;
  pickedFile: any;
  task: AngularFireUploadTask;
  selectedFile: string;
  uploadProgress = 0;
  newDate = '';
  audioUrl = '';
  uploadedFileURL: Observable<string>;
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
    this.newDate = this.selectedPray.dateOfPray.toISOString();
    if ((
      this.platform.is('mobile') &&
      !this.platform.is('hybrid') ||
      this.platform.is('desktop')
    )) {
      this.usePicker = true; // do not show any time
    }
  }

  ionViewWillEnter() {
    if (this.loggedUser.role.toUpperCase() !== 'ADMIN') {
      this.modalCtrl.dismiss();
    }
  }

  onEditPray(inputData) {
    if (
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'audio' &&
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'video'
        ) {
        console.error('unsupported file type :( ');
        return;
    }
    let uploadedFileName = '';
    const storageFolderName = GlobalConstants.prayCollection + '/'; // 'Members/';
    if (this.pickedFile) {
      uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    } else {
      uploadedFileName = this.selectedPray.fileName;
    }
    
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    const customMetadata = { app: 'Media Files' };
    // const oldFileName = member.fileName;


    // update database
    let record = {};
    record['dateOfPray'] = new Date( inputData.form.value.dateOfPray);
    record['title'] = inputData.form.value.title;
    record['verseOfPray'] = inputData.form.value.verseOfPray;
    record['category'] = inputData.form.value.category;
    record['id'] = this.selectedPray.id;
    record['word'] = inputData.form.value.word;

    this.loadingCtrl.create({message: 'Edting Pray...'})
    .then(loadingEl => {
      loadingEl.present();

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

          this.uploadedFileURL = fileRef.getDownloadURL();
          this.subs.push(this.uploadedFileURL.subscribe(resp => {
            record['downloadUrl'] = resp;

            this.prayService.edit_pray(record, uploadedFileName )
            .then(data => {
              if (this.selectedPray.fileName) {
                this.prayService.delete_image(this.selectedPray.fileName);
              }
              toast.present();
              loadingEl.dismiss();
              inputData.form.reset();
              this.modalCtrl.dismiss(null, 'pray-upload-success');
            })
            .catch(error => {
              this.showAlert(error.message);
            });
          }));
        }).catch(error => {
          loadingEl.dismiss();
          this.showAlert(error.message);
        });
      } else {
        
        if (this.selectedPray.downloadUrl === undefined || this.selectedPray.downloadUrl === '') {
          this.audioUrl = '';
          const storageFolderName = GlobalConstants.prayCollection + '/'; // 'Members/';
          const uploadedFileName = this.selectedPray.fileName;
          const fullPath = storageFolderName + uploadedFileName;
          const fileRef = this.storage.ref(fullPath);
      
          this.subs.push(fileRef.getDownloadURL()
          .subscribe(url => {
            record['downloadUrl'] = url;

            this.prayService.edit_pray(record, uploadedFileName )
            .then(() => {
              loadingEl.dismiss();
              inputData.form.reset();
              this.modalCtrl.dismiss(null, 'pray-upload-success');
            })
            .catch(error => {
              this.showAlert(error.message);
            });            
          }));

        } else {
          this.prayService.edit_pray(record, uploadedFileName )
          .then(() => {
            loadingEl.dismiss();
            inputData.form.reset();
            this.modalCtrl.dismiss(null, 'pray-upload-success');
          })
          .catch(error => {
            this.showAlert(error.message);
          });
        }

      }
    });
  }
/*   getDownloadUrl() {
    this.audioUrl = '';
    const storageFolderName = GlobalConstants.prayCollection + '/'; // 'Members/';
    const uploadedFileName = this.selectedPray.fileName;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);

    fileRef.getDownloadURL()
    .subscribe(url => {
      this.audioUrl = url;
    });
  } */
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
