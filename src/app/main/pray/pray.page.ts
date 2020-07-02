import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
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
  loggedUser: User;
  private subs: Subscription[] = [];
  loadedData = []; // Pray[];
  selectedData = [];
  
  selectedPray: Pray;
  audioUrl: string;
  isLoading = false;
  setCategory = '장년';

  constructor(
    // private storageRef: AngularFireStorage,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private prayService: PrayService,
 
    // private mediaCategoryService: MediaCategoryService,
    // private fireAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));

    this.subs.push(this.prayService.prays
      .subscribe(data => {
        if (data) {
          this.loadedData = data;
          this.selectedData = this.loadedData.filter(data => data.category === this.setCategory);
        }
      })
    );
  }

  ionViewWillEnter() {
    this.authService.getCurrentUser().subscribe(user => {
      this.loadingCtrl.create({message: 'Loading 기도력...'})
      .then(loadingEl => {
          loadingEl.present();
          this.subs.push(this.prayService.fetchPrays()
            .subscribe(data => {
              loadingEl.dismiss();
            }, error => {
              loadingEl.dismiss();
              this.showAlert(error.message);
            })
          );
      });
    });
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

  onPrayDetail(pray: Pray) {
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
      if (resultData.role === 'confirm') {
        console.log('BOOKED!');
      }
    });
  }
  
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === '장년') {
      this.selectedData = this.loadedData.filter(data => data.category === '장년');
      this.setCategory = '장년';
    } else {
      this.selectedData = this.loadedData.filter(data => data.category === '어린이');
      this.setCategory = '어린이';
    }

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
