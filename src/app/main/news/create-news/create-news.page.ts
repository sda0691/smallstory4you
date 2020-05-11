import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewsService } from '../news.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.page.html',
  styleUrls: ['./create-news.page.scss'],
})
export class CreateNewsPage implements OnInit, OnDestroy {
  form: FormGroup;
  private newsSub: Subscription;

  constructor(
    private newsService: NewsService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      note: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(500)]
      })
    });
  }

  onCreateNews() {
    if (!this.form.valid) {
      return;
    }

    // console.log(this.form);

    this.loadingCtrl.create({message: 'Posting News...'})
      .then(loadingEl => {
        loadingEl.present();
        this.newsService.postNews(
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
