import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NewsService } from './news.service';
import { News } from './News.model';
import { ModalController, LoadingController } from '@ionic/angular';
import { MyinfoComponent } from 'src/app/auth/myinfo/myinfo.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

import { CreateNewsComponent } from './create-news/create-news.component';
import { User } from 'src/app/auth/user.model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { DetailNewsComponent } from './detail-news/detail-news.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewsPage implements OnInit, OnDestroy {
  
  isAuth = false;
  private authSub: Subscription;
  private newsSub: Subscription;
  private subs: Subscription[] = [];
  loggedUser: User;
  loadedData = [];
  downloadUrls = [];
  fileRef: AngularFireStorageReference;
  isLoading = false;
  
  constructor(
    private newsService: NewsService,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private storage: AngularFireStorage,
    ) { }

  ngOnInit() {
    const storageFolderName = GlobalConstants.newsCollection + '/'; // 'Members/';
    let fullPath = '';
    let fileRef = '';
    
    this.subs.push(this.newsService.news
      .subscribe(data => {
        if (data) {
          this.loadedData = data;
          for (const news of this.loadedData) {
            if (news.fileName.length > 0) {
              for (const file of news.fileName) {
                fullPath = storageFolderName + file;
                this.fileRef = this.storage.ref(fullPath);
                
                this.fileRef.getDownloadURL()
                .subscribe(url => {
                  news.downloadUrl.push(url);
                });
              }
            }
          }
          console.log(this.loadedData); 
        }
      })
    );
    this.subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));
  }
  ionViewWillEnter() {
    this.fetchNews();
  }
  fetchNews() {
    this.subs.push(this.authService.getCurrentUser().subscribe(user => {
      this.loadingCtrl.create({message: 'Loading Media...'})
      .then(loadingEl => {
          loadingEl.present();
          this.subs.push(this.authService.loggedUser.subscribe(user => {
            if (user) {
              this.isAuth = true;
            } else {
              this.isAuth = false;
            }
            this.subs.push(this.newsService.fetchNews() // get all records, then filter by category
              .subscribe(news => {
                console.log(news);
                this.loadedData = news;
                loadingEl.dismiss();
              }, error => {
                loadingEl.dismiss();
                console.log(error);
              })
            );
          }));
      });
    }));
  }
  openAddNews() {
    this.modalCtrl.create({
      component: CreateNewsComponent,
      componentProps: {loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

  openNewsDetail(news: News) {
    this.modalCtrl.create({
      component: DetailNewsComponent,
      componentProps: {selectedNews: news, loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }


  onMyInfo() {
    this.modalCtrl.create({
      component: MyinfoComponent// ,
      // componentProps: {selectedMember: member}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('BOOKED!');
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
