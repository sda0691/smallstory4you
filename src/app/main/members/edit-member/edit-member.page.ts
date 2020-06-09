import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router,  Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MembersService } from '../members.service';
import { NavController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { Member } from '../member.model';
import { Subscription, observable, Observable } from 'rxjs';
import { FormGroup, NgForm } from '@angular/forms';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';

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
  pickedFile: any;
  private membersSub: Subscription;



  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private membersService: MembersService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController
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

    this.route.paramMap.subscribe(parmaMap => {
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
          this.membersSub = this.membersService
          .get_member(memberId)
          .subscribe(data => {
            this.member = data;
            this.selectedImage = data.imageUrl;
            this.isLoading = false;
            loadingEl.dismiss();
          });
        });
    });
  }


  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
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
  onEditMember(inputData) {
    const isEdit = true;

    let record = {};
    record['name'] = inputData.form.value.name;
    record['phone1'] = inputData.form.value.phone;
    record['address'] = inputData.form.value.address;
    record['imageUrl'] = this.selectedImage;
    record['fileName'] = this.member.fileName;
    record['id'] = this.member.id;

    this.loadingCtrl.create({message: 'Editing Member...'})
      .then(loadingEl => {
        loadingEl.present();
        if(!this.pickedFile) {
          this.membersService.edit_member(record)
            .then(() => {
              loadingEl.dismiss();
              inputData.form.reset();
              this.router.navigate(['/main/tabs/members']);
            })
            .catch(error => {
              loadingEl.dismiss();
              this.showAlert(error.message);
            });
        } else {
          this.membersService.uploadImage( record, isEdit, this.pickedFile)
          .subscribe(() => {
            loadingEl.dismiss();
            inputData.form.reset();
            this.router.navigate(['/main/tabs/members']);
          }, error => {
            loadingEl.dismiss();
            this.showAlert(error.message);
          });

        }
        /* .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/main/tabs/members']);
        }); */
      });
    /* console.log('test');
    console.log(this.form.value.address);
    this.loadingCtrl.create({message: 'Editing Member...'})
      .then(loadingEl => {
        loadingEl.present();
        this.membersService.EditMember(
          this.member.id,
          this.form.value.name,
          this.form.value.phone,
          this.form.value.address
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/main/tabs/members']);
        });
      }); */

  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Error',
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

  ngOnDestroy() {
    if (this.membersSub) {
      this.membersSub.unsubscribe();
    }
  }
}
