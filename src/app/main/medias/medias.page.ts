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
  audioUrl: string;
  loggedUser: User;
  isAuth = false;
  loadedData = []; // Member[];
  renderedMedias = [];
  filteredMedias = [];  // get from loadedData when user select category
  indexCount = 0;
  loadedMediaCategory = [];
  counter = 0;
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

    this.subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));
  }
  ionViewWillEnter() {
    this.authService.getCurrentUser().subscribe(user => {
      if (this.segCategory.toUpperCase() !== 'ALL') {
        this.segCategory = 'all';  // tab
      } else {
        this.fetchMedia('All');   // page_load
      }
    });
  }
  fetchMedia(category: string) {
    this.loadingCtrl.create({message: 'Loading Media...'})
    .then(loadingEl => {
        loadingEl.present();

        this.subs.push(this.fetchMediaCategory()
          .subscribe(data => {
            this.authService.loggedUser.subscribe(user => {
              if (user) {
                this.isAuth = true;
              } else {
                this.isAuth = false;
              }
              this.subs.push(this.mediaService.fetchMedias(category) // get all records, then filter by category
                .subscribe(media => {
                  if (this.segCategory.toUpperCase() === 'ALL') {
                    this.filteredMedias = media;
                  } else {
                    this.filteredMedias = media.filter(data => data.category === this.segCategory);
                  }
                  this.resetCategory();
                  this.showMore();

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
      componentProps: {selectedMedia: media, loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
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

  private showMore() {
    let count = 0;
    if (this.filteredMedias) {
      for (let i = this.counter + 1 ; i <= this.filteredMedias.length; i++){
        if (this.segCategory.toUpperCase() === 'ALL' || this.filteredMedias[i - 1].category === this.segCategory) {
          this.renderedMedias.push(this.filteredMedias[i - 1]);
          count++;
          if (count % 2 === 0) {
            break;
          }
        }
      }
      this.counter += 2;
    }
  }


  selectCategory(event) {
    // new solution without getting to firebase
    this.indexCount = 0;
    this.resetCategory();
    this.segCategory = event.detail.value;
    if (event.detail.value.toUpperCase() === 'ALL') {
      this.filteredMedias = this.loadedData;
    } else {
      this.filteredMedias = this.loadedData.filter(media => media.category === this.segCategory);
    }
    this.showMore();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
