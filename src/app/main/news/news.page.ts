import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NewsService } from './news.service';
import { News } from './News.model';
import { ModalController } from '@ionic/angular';
import { MyinfoComponent } from 'src/app/auth/myinfo/myinfo.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewsPage implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private authSub: Subscription;
  private newsSub: Subscription;

  loadedNews: News [];
  constructor(
    private newsService: NewsService,
    private modalCtrl: ModalController,
    private authService: AuthService
    ) { }

  ngOnInit() {
    console.log('dfjdlsfjdsjfdsjfdsjfjsdkfjdsjf')
    
    // this.loadedNews = this.newsService.getAllNews();
    this.newsSub = this.newsService.allNews.subscribe(news => {
      this.loadedNews = news;
    });
  }

  ionViewWillEnter() {
    this.authService.userIsAuthenticatedObser.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      })
    ).subscribe(resData => {
      this.isUserAuthenticated = resData; 
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
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.newsSub) {
      this.newsSub.unsubscribe();
    }    
  }
}
