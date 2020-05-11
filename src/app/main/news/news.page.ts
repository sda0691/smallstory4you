import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from './news.service';
import { News } from './News.model';
import { ModalController } from '@ionic/angular';
import { MyinfoComponent } from 'src/app/auth/myinfo/myinfo.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
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
    // this.loadedNews = this.newsService.getAllNews();
    this.newsSub = this.newsService.allNews.subscribe(news => {
      this.loadedNews = news;
    });

    this.authSub = this.authService.userIsAuthenticated.subscribe(value => {
      this.isUserAuthenticated = value;
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
