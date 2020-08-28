import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { LoadingController, ModalController, AlertController, IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { CreatePrayComponent } from './create-pray/create-pray.component';
import { PrayService } from './pray.service';
import { Pray } from './Pray.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { GlobalConstants } from 'src/app/common/global-constants';
import { DetailPrayComponent } from './detail-pray/detail-pray.component';
import { SegmentChangeEventDetail } from '@ionic/core';


@Component({
  selector: 'app-pray',
  templateUrl: './pray.page.html',
  styleUrls: ['./pray.page.scss'],
})
export class PrayPage implements OnInit, OnDestroy {
  @ViewChild('audio', {static: false}) audioPlayer: ElementRef; 

  loggedUser: User;
  private subs: Subscription[] = [];
  loadedData = []; // Pray[];
  selectedData = [];
  
  selectedPray: Pray;
  audioUrl: string;
  isLoading = false;
  
  buttonColor = 'light';
  d = new Date();
  setCategory = '장년';
  setCategory1 = this.d.toLocaleDateString();
  lenVerseOfPray = 'short';
  day = '';
  arrayIndex = 0;

  dayPrevColor = 'dark';
  dayPrevIconColor = 'dark';
  dayNextColor = 'light';
  dayNextIconColor = 'light';
  filteredData = [];
  constructor(
    // private storageRef: AngularFireStorage,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private prayService: PrayService,
 
    // private mediaCategoryService: MediaCategoryService,
    // private fireAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit() {
    console.log(this.setCategory1);
    this.subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));

    this.subs.push(this.prayService.prays
      .subscribe(data => {
        if (data) {
          this.loadedData = data;
          this.getLatestPrays();
          // console.log(this.filteredData);
        }
      })
    );
  }
  getLatestPrays() {
    this.filteredData = this.loadedData.filter(data => data.category === this.setCategory);

    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    this.selectedData = this.filteredData.filter(function (value) {
      let newDate = new Date(value.dateOfPray);
      return newDate <= today;
     }); 
    this.selectedData = this.selectedData.slice(0, 7);
    this.selectedPray = this.selectedData[0];
    this.getTodayPray();
  }
  getTodayPray() {
    if (this.selectedPray) {
      if (this.selectedPray.verseOfPray.length > 150 && this.selectedPray.verseOfPray.length  < 300 ) {
        this.lenVerseOfPray = 'medium';
      } else if (this.selectedPray.verseOfPray.length >= 300) {
        this.lenVerseOfPray = 'large';
      }
      switch (this.selectedPray.dateOfPray.getDay()) {
        case 0: this.day = '일'; break;
        case 1: this.day = '월'; break;
        case 2: this.day = '화'; break;
        case 3: this.day = '수'; break;
        case 4: this.day = '목'; break;
        case 5: this.day = '금'; break;
        case 6: this.day = '토'; break;
      }
      // this.getDownloadUrl();
      this.audioReset(this.selectedPray.downloadUrl);
       // this.audioUrl = this.selectedPray.downloadUrl;
    }
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
  audioReset(downloadUrl) {
    this.audioUrl = '';
    this.audioUrl = downloadUrl;
    this.audioPlayer.nativeElement.load();
    this.audioPlayer.nativeElement.pause();
  }
  onPreDay() {
    if (this.arrayIndex >= this.selectedData.length - 1) {
      return;
    }
    this.arrayIndex ++;
    if (this.arrayIndex === this.selectedData.length - 1 ) {
      this.dayPrevColor = 'light';
      this.dayPrevIconColor = 'light';
      this.dayNextColor = 'black';
      this.dayNextIconColor = 'black';
    } else {
      this.dayPrevColor = 'black';
      this.dayPrevIconColor = 'black';
      this.dayNextColor = 'black';
      this.dayNextIconColor = 'black';
    }
    this.selectedPray = this.selectedData[this.arrayIndex];
    this.getTodayPray();
  }
  onNextDay() {
    if (this.arrayIndex  === 0) {
      return;
    }
    this.arrayIndex --;
    if (this.arrayIndex === 0) {
      this.dayPrevColor = 'black';
      this.dayPrevIconColor = 'black';
      this.dayNextColor = 'light';
      this.dayNextIconColor = 'light';        
    } else {
      this.dayPrevColor = 'black';
      this.dayPrevIconColor = 'black';
      this.dayNextColor = 'black';
      this.dayNextIconColor = 'black';        
    }
    this.selectedPray = this.selectedData[this.arrayIndex];
    this.getTodayPray();
  }
  selectPray(pray) {
    this.selectedPray = pray;
    this.getTodayPray();
  }


  ionViewWillEnter() {
    this.arrayIndex = 0;
    this.subs.push(this.authService.getCurrentUser().subscribe(user => {
      this.loadingCtrl.create({message: 'Loading 기도력...'})
      .then(loadingEl => {
          loadingEl.present();
          if (this.loadedData.length <= 0) {
            this.subs.push(this.prayService.fetchPrays()
              .subscribe(data => {
                loadingEl.dismiss();
              }, error => {
                loadingEl.dismiss();
                this.showAlert(error.message);
              })
            );
          } else {
            loadingEl.dismiss();
          }
      });
    }));
  }

  onAddPray() {
    this.modalCtrl.create({
      component: CreatePrayComponent,
      componentProps: {}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
    /* .then(resultData => {
      if (resultData.role !== 'cancel') {
        if (this.segCategory !== 'all') {
          this.resetCategory();
          this.segCategory = 'all' ; // call ionChange
        }
      }
    }); */
  }
/*   openEdit(pray: Pray) {
    this.modalCtrl.dismiss();
    this.modalCtrl.create({
      component: EditPrayComponent,
      componentProps: {selectedPray: pray, loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  } */
  onPrayDetail(pray: Pray, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.modalCtrl.create({
      component: DetailPrayComponent,
      componentProps: {selectedPray: pray, loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      // console.log(resultData.data, resultData.role);
/*       if (resultData.role === 'confirm') {
        console.log('BOOKED!');
      } */
    });
  }
  
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {

    this.arrayIndex = 0;
    this.dayPrevColor = 'black';
    this.dayPrevIconColor = 'black';
    this.dayNextColor = 'light';
    this.dayNextIconColor = 'light';
    this.setCategory = event.detail.value;
    this.getLatestPrays();
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
