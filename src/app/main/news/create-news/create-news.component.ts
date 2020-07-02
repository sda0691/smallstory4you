import { Component, OnInit, ElementRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { NewsService } from '../news.service';
import { CameraOptions, Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { User } from 'src/app/auth/user.model';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { resolve } from 'url';
import { async } from '@angular/core/testing';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss'],
})
export class CreateNewsComponent implements OnInit, OnDestroy {
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  @Input() loggedUser: User;

  status = "public";
  usePicker = false;
  pickedFile: any;
  pickedFiles = [];
  selectedImage: string;
  newImages = [];
  fileRef: AngularFireStorageReference;
  uploadedFileNames = [];
  downloadUrls = [];
  task: AngularFireUploadTask;
  uploadedFileURL: Observable<string>;
  private subs: Subscription[] = [];
  
  constructor(
    private storage: AngularFireStorage,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private newsService: NewsService,
    private modalCtrl: ModalController,
    private platform: Platform,
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

  onAddNews2(inputData) {

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




/*     const storageFolderName = GlobalConstants.newsCollection + '/'; // 'Members/';
    const uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath); */
    const customMetadata = { app: 'News Files' }; 
    
    const storageFolderName = GlobalConstants.newsCollection + '/'; 
    let uploadedFileName = '';
    let fullPath = '';

    this.loadingCtrl.create({message: 'Adding a new news...'})
    .then(loadingEl => {
      loadingEl.present();

      if (!this.pickedFiles || this.pickedFiles.length <= 0) {
        this.newsService.add_news(inputData.form.value, this.uploadedFileNames, this.downloadUrls)
        .subscribe(() => {
          loadingEl.dismiss();
          this.modalCtrl.dismiss(null, 'media-upload-success');
        });
      } else {
        this.newsService.add_news(inputData.form.value, this.uploadedFileNames, this.downloadUrls)
        .subscribe(() => {
          for (const file of this.pickedFiles) {
            uploadedFileName = `${new Date().getTime()}_${file.name}`;
            fullPath = storageFolderName + uploadedFileName;
    
            this.fileRef = this.storage.ref(fullPath);
            this.task = this.storage.upload( fullPath, file, {customMetadata});
            this.task.then(async res => {
              const toast = await this.toastCtrl.create({
                duration: 3000,
                message: 'File upload finished!'
              });
              // file name array
              
    
              this.uploadedFileURL = this.fileRef.getDownloadURL();
              this.subs.push(this.uploadedFileURL.subscribe(resp => {
                // download url array
                this.downloadUrls.push(resp);
                this.uploadedFileNames.push(uploadedFileName);
    
                
    
              }));
            }); 
          }
        })
      }


      


    });
      
  }

  onAddNews(inputData) {

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
/*     const storageFolderName = GlobalConstants.newsCollection + '/'; // 'Members/';
    const uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath); */
    const customMetadata = { app: 'News Files' }; 
    
    const storageFolderName = GlobalConstants.newsCollection + '/'; 
    let uploadedFileName = '';
    let fullPath = '';

    this.loadingCtrl.create({message: 'Adding a new news...'})
    .then(loadingEl => {
      loadingEl.present();

      // for (let i = 0; i < this.pickedFiles.length; i++) {
      let fileCount = 0;
      for (const file of this.pickedFiles) {
        fileCount ++ ;
        uploadedFileName = `${new Date().getTime()}_${file.name}`;
        fullPath = storageFolderName + uploadedFileName;
        //let test = this.uploadImages(fullPath, file, customMetadata, uploadedFileName);
        // console.log(test);
        this.uploadedFileNames.push(uploadedFileName);
        this.fileRef = this.storage.ref(fullPath);
        this.task = this.storage.upload( fullPath, file, {customMetadata});
/*         this.task.then(async res => {
          const toast = await this.toastCtrl.create({
            duration: 3000,
            message: 'File upload finished!'
          });
        }); */
          // file name array
        
/* 
          this.uploadedFileURL = this.fileRef.getDownloadURL();
          this.subs.push(this.uploadedFileURL.subscribe(resp => {
            // download url array
            this.downloadUrls.push(resp);
            this.uploadedFileNames.push(uploadedFileName);

            if (fileCount === this.pickedFiles.length ) {
              this.newsService.add_news(inputData.form.value, this.uploadedFileNames, this.downloadUrls)
              .subscribe(() => {
                loadingEl.dismiss();
                this.modalCtrl.dismiss(null, 'media-upload-success');
              }
              , error => {
                this.showAlert(error.message);
              });
            }

          }));
        });  */

      }
      if (fileCount === this.pickedFiles.length ) {
        this.newsService.add_news(inputData.form.value, this.uploadedFileNames, this.downloadUrls)
        .subscribe(async() => {
          const toast = await this.toastCtrl.create({
            duration: 3000,
            message: 'File upload finished!'
          });
          loadingEl.dismiss();
          this.modalCtrl.dismiss(null, 'media-upload-success');
        }
        , error => {
          this.showAlert(error.message);
        });
      }
      console.log('test');


    });
      
  }

  uploadImages(fullPath, file, metaData, uploadedFileName) {
    return new Promise((resolve, reject) => {
      this.fileRef = this.storage.ref(fullPath);
      this.task = this.fileRef.put(file);


      // this.uploadedFileNames.push(uploadedFileName);
      const aaa = this.task.snapshotChanges().pipe(
        finalize(() => this.fileRef.getDownloadURL().subscribe(data => {
          console.log('aaa');
          console.log(data);
          resolve(data);
        }))
      )
  
    });



/*     this.task = this.storage.upload( fullPath, file, metaData);
    this.task.then(async res => {
      // file name array
      this.uploadedFileNames.push(uploadedFileName);

      this.uploadedFileURL = this.fileRef.getDownloadURL();
      this.subs.push(this.uploadedFileURL.subscribe(resp => {
        // download url array
        this.downloadUrls.push(resp);
      }));
    }); */
  }
  onFileChosen(event: FileList) {
    // const pickedFile = (event.target as HTMLInputElement).files[0];
    if (event.length === 0) {
      return;
    }
    this.pickedFile = event.item(0);
    this.pickedFiles.push(event.item(0));
    console.log(this.pickedFiles);
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.newImages.push({imageUrl: dataUrl});
      console.log(this.newImages);
      // this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL (this.pickedFile);
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 100,
      // source: CameraSource.Prompt,
      // correctOrientation: true,
      // height: 320,
      // width: 600,
      // resultType: CameraResultType.DataUrl,

      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos

  

    }).then(image => {
      this.selectedImage = image.dataUrl;
      this.newImages.push({imageUrl: image.dataUrl});
      try {
        if (this.selectedImage.includes('image/png')) {
          this.pickedFile = base64toBlob(
            this.selectedImage.replace('data:image/png;base64,', ''),
             'image/png');
        } else {
          this.pickedFile = base64toBlob(
            this.selectedImage.replace('data:image/jpeg;base64,', ''),
             'image/jpeg');
        }
      } catch (error) {
        console.log(error);
        return;
      }
      // this.imagePick.emit(image.dataUrl);
      // console.log(image.dataUrl);
    }).catch(error => {
      if (this.usePicker) {
        this.filePickerRef.nativeElement.click();
      }
      console.log(error);
      return false;
    });
  }
  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
  delete(index) {
    console.log(index);
    if (index !== -1) {
      this.newImages.splice(index, 1);
      this.pickedFiles.splice(index, 1);
    }
    console.log(this.newImages);
    console.log(this.pickedFiles);
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
