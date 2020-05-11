import { Component, OnInit, OnDestroy } from '@angular/core';
import { News } from '../News.model';
import { NewsService } from '../news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.page.html',
  styleUrls: ['./news-details.page.scss'],
})
export class NewsDetailsPage implements OnInit, OnDestroy {
  news: News;
  private newsSub: Subscription;
  
  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('newsId')) {
        this.navCtrl.navigateBack('/main/tabs/news');
        console.log('news details error')
        return;
      }
      this.newsService.getNews(Number(paramMap.get('newsId'))).subscribe(news => {
        this.news = news;
      });
      // this.news = this.newsService.getNews(Number(paramMap.get('newsId')));
    });
  }

  onDeleteNews(newsId: number) {
    this.loadingCtrl.create({message: 'Deleting News...'})
      .then(loadingEl => {
        loadingEl.present();
        this.newsService.DeleteNews(newsId).subscribe(() => {
          loadingEl.dismiss();
          this.router.navigate(['/main/tabs/news']);
        });
      });
  }

  ngOnDestroy() {
    if (this.newsSub) {
      this.newsSub.unsubscribe();
    }
  }
}
