import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { Praise } from '../praise.model';
import { AngularFireUploadTask } from '@angular/fire/storage/task';
import { Platform, LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { PraiseService } from '../praise.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-praise',
  templateUrl: './edit-praise.component.html',
  styleUrls: ['./edit-praise.component.scss'],
})
export class EditPraiseComponent implements OnInit {
  @Input() selectedPraise: Praise;
  @Input() loggedUser: User;

  usePicker = false;
  pickedFile: any;
  task: AngularFireUploadTask;
  selectedFile: string;
  uploadProgress = 0;
  uploadedFileURL: Observable<string>;
  
  constructor(
    private platform: Platform,
    private praiseService: PraiseService,
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
  // if user is not admin, return to previous page
  ionViewWillEnter() {
    if (this.loggedUser.role.toUpperCase() !== 'ADMIN') {
      this.modalCtrl.dismiss();
    }
  }

  onEditPraise(inputData) {
    if (
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'audio' &&
        this.pickedFile && this.pickedFile.type.split('/')[0] !== 'video'
        ) {
        console.error('unsupported file type :( ');
        return;
    }
    let uploadedFileName = '';
    const storageFolderName = GlobalConstants.praiseCollection + '/'; // 'Members/';
    if (this.pickedFile) {
      uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    } else {
      uploadedFileName = this.selectedPraise.fileName;
    }
    
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    const customMetadata = { app: 'Praise Files' };
    const oldFileName = this.selectedPraise.fileName;
    // const oldFileName = member.fileName;

    let record = {};
    record['title'] = inputData.form.value.title;
    record['singer'] = inputData.form.value.singer;
    record['genre'] = inputData.form.value.genre;
    record['category'] = inputData.form.value.category;
    record['format'] = inputData.form.value.format;
    record['youtubeLink'] = inputData.form.value.youtubeLink;
    record['fileName'] = uploadedFileName;
    record['id'] = this.selectedPraise.id;
    record['whoUpdated'] = this.loggedUser.id;
    record['whenUpdated'] = new Date();

    this.loadingCtrl.create({message: 'Edting praise...'})
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
            record['downloadUrl'] = resp;

            this.praiseService.edit_praise(record, uploadedFileName)
              .subscribe(data => {
                if (oldFileName) {
                  this.praiseService.delete_image(oldFileName);
                }
                toast.present();
                loadingEl.dismiss();
                inputData.reset();
                this.modalCtrl.dismiss(null, 'praise-upload-success');
              }, error => {
                this.showAlert(error.message);
            });

          }, error => {
            loadingEl.dismiss();
            this.showAlert(error.message);
          });
        });

      } else {
        this.praiseService.edit_praise(record, uploadedFileName)
          .subscribe(() => {
            loadingEl.dismiss();
            inputData.form.reset();
            this.modalCtrl.dismiss(null, 'praise-upload-success');
        });
      }
    });
  }
  onDeletePraise() {
    this.alertCtrl.create({
      header: 'Warning',
      message: 'Are you sure to delete?',
      buttons: [{text: 'Okey',
        handler: () => {
          this.praiseService.delete_praise(this.selectedPraise);
          this.modalCtrl.dismiss();
          this.router.navigate(['/main/tabs/praise']);
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
      // header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
}
