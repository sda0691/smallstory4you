import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MembersService } from '../members.service';
import { Router } from '@angular/router';
import { LoadingController, Platform, AlertController } from '@ionic/angular';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';

import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Member } from '../member.model';
import { AuthService } from 'src/app/auth/auth.service';



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
  selector: 'app-create-member',
  templateUrl: './create-member.page.html',
  styleUrls: ['./create-member.page.scss'],
})
export class CreateMemberPage implements OnInit {
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  form: NgForm;
  selectedImage: string;
  usePicker = false;
  pickedFile: any;
  isAuth = false;


  constructor(
    private storage: AngularFireStorage, private database: AngularFirestore,

    private platform: Platform,
    private membersService: MembersService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {  }

  ngOnInit() {
    if ((
      this.platform.is('mobile') &&
      !this.platform.is('hybrid') ||
      this.platform.is('desktop')
    )) {
      this.usePicker = true; // do not show any time
    }
    this.authService.userIsAuthenticatedObser.subscribe(isAuth => {
      this.isAuth = isAuth;
    });
  }
  onAddMember1(inputData) {
    if (this.pickedFile && this.pickedFile.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    const isEdit = false;

    if (!this.isAuth) {
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

    let upload = this.membersService.uploadImage1(this.pickedFile);
    upload.then().then(res => {
      // const uploadUrl = upload.downloadURL();
      let record = {};
      record['name'] = inputData.form.value.name;
      record['phone1'] = inputData.form.value.phone1;
      record['address'] = inputData.form.value.address;
      record['imageUrl'] = ''; //res.task.ref_.uploadUrl;
      record['fileName'] = res.metadata.name;
      this.membersService.add_member(record);
    })
  }
  onAddMember(inputData) {

    // Validation for Images Only
    if (this.pickedFile && this.pickedFile.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    const isEdit = false;



    // const isAuth = this.authService.userIsAuthenticated;
    if (!this.isAuth) {
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

    console.log(inputData.form);
    this.loadingCtrl.create({message: 'Adding a new member...'})
      .then(loadingEl => {
        loadingEl.present();
        if (!this.pickedFile) {
          let record = {};
          record['name'] = inputData.form.value.name;
          record['phone1'] = inputData.form.value.phone1;
          record['address'] = inputData.form.value.address;
          record['imageUrl'] = '';
          record['fileName'] = '';

          this.membersService.add_member(record)
            .then(resData => {
              loadingEl.dismiss();
              inputData.reset();
              this.router.navigate(['/main/tabs/members']);
              })
            .catch (error => {
                loadingEl.dismiss();
              }
            );

        } else {
            this.membersService.uploadImage( inputData.form.value, isEdit, this.pickedFile )
            .subscribe(resp => {
              inputData.form.reset();
              loadingEl.dismiss();
              this.router.navigate(['/main/tabs/members']);
            }, error => {
                console.log(error);
            });
          }
      });
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
      source: CameraSource.Prompt

  

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

  onFileChosen(event: FileList) {
   // const pickedFile = (event.target as HTMLInputElement).files[0];
    this.pickedFile = event.item(0);
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      // this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL (this.pickedFile);
  }
}
