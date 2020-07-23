import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router,  Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MembersService } from '../members.service';
import { NavController, LoadingController, Platform, AlertController, ToastController } from '@ionic/angular';
import { Member } from '../member.model';
import { Subscription, observable, Observable } from 'rxjs';
import { FormGroup, NgForm } from '@angular/forms';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireUploadTask } from '@angular/fire/storage/task';

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
  selector: 'app-edit-member',
  templateUrl: './edit-member.page.html',
  styleUrls: ['./edit-member.page.scss'],
})
export class EditMemberPage implements OnInit, OnDestroy {
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  form: NgForm;
  member: any;
  test: string;
  isLoading = false;
  usePicker = false;
  selectedImage: string;
  selectedFileName: string;
  pickedFile: any;
  private membersSub: Subscription;
  task: AngularFireUploadTask;
  uploadedFileURL: Observable<string>;
  private subs: Subscription[] = [];

  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private membersService: MembersService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: AngularFireStorage,
    private toastCtrl: ToastController
  ) {
    if ((
      this.platform.is('mobile') &&
      !this.platform.is('hybrid') ||
      this.platform.is('desktop')
    )) {
      this.usePicker = true;
    }
  }

  ngOnInit() {
/*     this.route.paramMap.subscribe(parmaMap => {
      if (!parmaMap.has('memberId')) {
        this.navCtrl.navigateBack('/main/tabs/members');
        return;
      }
      this.membersSub = this.membersService
        .getMember(+parmaMap.get('memberId'))
        .subscribe(member => {
          this.member = member;
      });
    }); */

    this.subs.push(this.route.paramMap.subscribe(parmaMap => {
      if (!parmaMap.has('memberId')) {
        this.navCtrl.navigateBack('/main/tabs/members');
        return;
      }
      const memberId = parmaMap.get('memberId');


      console.log('test');
      // const songId: string = this.route.snapshot.paramMap.get('id');
      this.isLoading = true;

      // #1 works
      /*this.membersService
        .getMember(memberId)
        .subscribe(data => {
          const test = new Member(
             data.payload.doc.id,
             data.payload.doc.data()['groupid'],
             data.payload.doc.data()['name'],
             data.payload.doc.data()['phone1'],
             data.payload.doc.data()['imageUrl'],
             data.payload.doc.data()['address']
          )
          this.member = test;
          this.isLoading = false;
        }); */

      // #2 works
      this.loadingCtrl.create({message: 'Loading Member...'})
        .then(loadingEl => {
          loadingEl.present();
          this.subs.push(this.membersSub = this.membersService
            .get_member(memberId)
            .subscribe(data => {
              this.member = data;
              this.selectedImage = data.imageUrl;
              this.selectedFileName = data.fileName;
              this.isLoading = false;
              loadingEl.dismiss();
          }));
        });
    }));
  }


  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 100,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 500,
      width: 500,
      resultType: CameraResultType.DataUrl
    }).then(image => {
      this.selectedImage = image.dataUrl;
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
  /* onEditMember(inputData) {
    const isEdit = true;
    let uploadedFileName = '';
    const storageFolderName = GlobalConstants.memberCollection + '/'; // 'Members/';
    if (this.pickedFile) {
      uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    } else {
      uploadedFileName = this.member.fileName;
    }
    let record = {};
    record['name'] = inputData.form.value.name;
    record['phone1'] = inputData.form.value.phone;
    record['address'] = inputData.form.value.address;
    // record['imageUrl'] = this.selectedImage;
    record['fileName'] = this.member.fileName;
    record['id'] = this.member.id;

    record['homePhone'] = inputData.form.value.homePhone === undefined ? '' : inputData.form.value.homePhone ;
    record['businessPhone'] = inputData.form.value.businessPhone === undefined ? '' : inputData.form.value.businessPhone;
    record['ageStatus'] = inputData.form.value.ageStatus === undefined ? '' : inputData.form.value.ageStatus ;

    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    const customMetadata = { app: 'Media Files' };

    this.loadingCtrl.create({message: 'Editing Member...'})
      .then(loadingEl => {
        loadingEl.present();
        this.membersService.edit_member(record, uploadedFileName)
          .subscribe(() => {
            if (this.pickedFile) {
              this.task = this.storage.upload( fullPath, this.pickedFile, {customMetadata});

              this.task.then(async res => {
                const toast = await this.toastCtrl.create({
                  duration: 3000,
                  message: 'File upload finished!'
                });

                if (this.selectedFileName) {
                  this.membersService.delete_image(this.selectedFileName);
                }

                toast.present();
                loadingEl.dismiss();
                inputData.form.reset();
                this.router.navigate(['/main/tabs/members']);
                // this.modalCtrl.dismiss(null, 'media-upload-success');
              }).catch(error => {
                loadingEl.dismiss();
                this.showAlert(error.message);
              });
            } else {
              loadingEl.dismiss();
              inputData.form.reset();
              this.router.navigate(['/main/tabs/members']);
            }
          }
          , error => {
            loadingEl.dismiss();
            this.showAlert(error.message);
          });
        });
  } */
  onEditMember(inputData) {
    const isEdit = true;
    let uploadedFileName = '';
    const storageFolderName = GlobalConstants.memberCollection + '/'; // 'Members/';
    if (this.pickedFile) {
      uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    } else {
      uploadedFileName = this.member.fileName;
    }
    let record = {};
    record['name'] = inputData.form.value.name;
    record['phone1'] = inputData.form.value.phone;
    record['address'] = inputData.form.value.address;
    // record['imageUrl'] = this.selectedImage;
    record['fileName'] = uploadedFileName;
    record['id'] = this.member.id;

    record['homePhone'] = inputData.form.value.homePhone === undefined ? '' : inputData.form.value.homePhone ;
    record['businessPhone'] = inputData.form.value.businessPhone === undefined ? '' : inputData.form.value.businessPhone;
    record['ageStatus'] = inputData.form.value.ageStatus === undefined ? '' : inputData.form.value.ageStatus ;

    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    const customMetadata = { app: 'Media Files' };
    const oldImageFileName = this.member.fileName;
  
    this.loadingCtrl.create({message: 'Editing Member...'})
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
            this.subs.push(this.uploadedFileURL.subscribe(resp => {
              record['imageUrl'] = resp;

              this.subs.push(this.membersService.edit_member(record, uploadedFileName)
              .subscribe(() => {
 
                if (oldImageFileName) {
                  this.membersService.delete_image(oldImageFileName);
                }
                toast.present();
                loadingEl.dismiss();
                inputData.form.reset();
                this.router.navigate(['/main/tabs/members']);
              }));

            }));



            // this.modalCtrl.dismiss(null, 'media-upload-success');
          }).catch(error => {
            loadingEl.dismiss();
            this.showAlert(error.message);
          });
        } else {
          this.subs.push(this.membersService.edit_member(record, uploadedFileName)
          .subscribe(() => {

            loadingEl.dismiss();
            inputData.form.reset();
            this.router.navigate(['/main/tabs/members']);
          }));
        }
      }
      , error => {
        // loadingEl.dismiss();
        this.showAlert(error.message);
      });
  }
  private showAlert(message: string) {
    this.alertCtrl.create({
      // header: 'Error',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  onFileChosen(event: Event) {
    this.pickedFile = (event.target as HTMLInputElement).files[0];
    if (!this.pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      // this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL (this.pickedFile);
  }

  onRemovePhoto() {
    if (!this.pickedFile && this.member.fileName.length > 0) {
      this.membersService.deletePhoto(this.member, this.member.fileName);
      this.selectedImage = '';
    }
  }
  ngOnDestroy() {
    if (this.membersSub) {
      this.membersSub.unsubscribe();
    }
  }
}
