import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from '../news.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { News } from '../News.model';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.page.html',
  styleUrls: ['./edit-news.page.scss'],
})
export class EditNewsPage implements OnInit, OnDestroy {
  form: FormGroup;
  private newsSub: Subscription;
  news: News;

  constructor(
    private newsService: NewsService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('newsId'))  {
        this.navCtrl.navigateBack('/main/tabs/news');
        return;
      }
      this.newsService.getNews(+paramMap.get('newsId')).subscribe(news => {
        this.news = news;
      });
      this.form = new FormGroup({
        title: new FormControl(this.news.title, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        note: new FormControl(this.news.note, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(500)]
        })
      });
    });
  }

  onEditNews() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({message: 'Editing News...'})
      .then(loadingEl => {
        loadingEl.present();
        this.newsService.editNews(
          this.news.id,
          this.form.value.title,
          this.form.value.note
        ).subscribe(() => {
          this.form.reset();
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
