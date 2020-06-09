import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ModalController, LoadingController, IonItemSliding } from '@ionic/angular';
import { CreateMediaComponent } from './create-media/create-media.component';
import { Subscription } from 'rxjs';
import { MdeiaService } from './media.service';
import { MediaCategoryService } from './media-category.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Media } from './media.model';
import { DetailMediaComponent } from './detail-media/detail-media.component';
import { UpperCasePipe } from '@angular/common';
import { EditMediaComponent } from './edit-media/edit-media.component';

@Component({
  selector: 'app-medias',
  templateUrl: './medias.page.html',
  styleUrls: ['./medias.page.scss'],
})
export class MediasPage implements OnInit, OnDestroy {
  isLoading = false;
  audioUrl: string;
  loggedUser: User;
  isAuth = false;
  loadedData = []; // Member[];
  renderedMedias = [];
  loadedMediaCategory = [];
  counter = 0;
  isLodading = false;
  segCategory = 'all';


  private subs: Subscription[] = [];
  
  constructor(
    private storageRef: AngularFireStorage,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private mediaService: MdeiaService,
    private mediaCategoryService: MediaCategoryService,
    private fireAuth: AngularFireAuth,
    private authService: AuthService
  ) {
      this.fireAuth.onAuthStateChanged(user => {
      console.log(user);

    });
  }

  ngOnInit() {
    this.subs.push(this.mediaService.medias
      .subscribe(data => {
        if (data) {
          this.loadedData = data;
        }
      })
    );
    this.subs.push(this.mediaCategoryService.mediaCategory
      .subscribe(data => {
        this.loadedMediaCategory = data;
      })
    );
  }
  getData() {

    if (this.loadedData) {
      for (let i = this.counter + 1; i <= this.loadedData.length; i++){
        this.renderedMedias.push(this.loadedData[i - 1]);
        if (i % 2 === 0) {
          break;
        }
      }
      this.counter += 2;
    }
  }

  ionViewWillEnter() {
    // this.resetCategory();
    if (this.segCategory.toUpperCase() !== 'ALL') {
      this.segCategory = 'all';  // tab
    } else {
      this.fetchMedia('All');  // page_load
    }
  }
  fetchMedia(category: string) {
    this.loadingCtrl.create({message: 'Loading Media...'})
    .then(loadingEl => {
        loadingEl.present();

        this.subs.push(this.fetchMediaCategory()
          .subscribe(data => {
            console.log(data);

            this.authService.loggedUser.subscribe(user => {
              if (user) {
                this.loggedUser = user;
                this.isAuth = true;
              } else {
                this.isAuth = false;
              }
              this.subs.push(this.mediaService.fetchMedias(category)
                .subscribe(media => {
                  console.log(media);
                  // data.
                  this.resetCategory();
                  this.getData();

                  loadingEl.dismiss();
                }, error => {
                  loadingEl.dismiss();
                  console.log(error);
                })
              );
            });
          }, error => {
            loadingEl.dismiss();
          })
        );
    });
  }
  fetchMediaCategory() {
    return this.mediaCategoryService.fetchMediaCategory();
  }

  onAddMedia() {
    this.modalCtrl.create({
      component: CreateMediaComponent,
      componentProps: {loadedMediaCategory: this.loadedMediaCategory}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
/*     .then(resultData => {
      this.resetCategory();
      this.segCategory = 'all';
      // this.fetchMedia('all');
      // console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('BOOKED!');
      }
    }); */

    .then(resultData => {
      if (resultData.role !== 'cancel') {
        if (this.segCategory !== 'all') {
          this.resetCategory();
          this.segCategory = 'all' ; // call ionChange
        }
      }
    });
  }

  private resetCategory() {
    this.renderedMedias = [];
    this.counter = 0;
  }
  openMediaDetail(media: Media) {
    this.modalCtrl.create({
      component: DetailMediaComponent,
      componentProps: {selectedMedia: media}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
/*     .then(resultData => {
      this.resetCategory();
      this.segCategory = 'all'; // call ionChange
    }); */
  }

  openEditMedia(media: Media, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.modalCtrl.create({
      component: EditMediaComponent,
      componentProps: {selectedMedia: media}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      if (resultData.role !== 'cancel') {
        if (this.segCategory !== 'all') {
          this.resetCategory();
          this.segCategory = 'all' ; // call ionChange
        }
      }
    });
  }

  selectCategory(event) {
/*     this.resetCategory();
    this.fetchMedia(event.detail.value); */


    // new solution without getting to firebase
    let count = 0;
    this.resetCategory();
    if (this.loadedData) {
      for (let i = this.counter ; i < this.loadedData.length; i++){
        if (event.detail.value.toUpperCase() === 'ALL' || this.loadedData[i].category === event.detail.value) {
          this.renderedMedias.push(this.loadedData[i]);
          count++;
          if (count % 2 === 0) {
            break;
          }
        }

      }
      this.counter += 2;
    }

  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
