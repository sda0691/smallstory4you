import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsPageRoutingModule } from './news-routing.module';

import { NewsPage } from './news.page';
import { MyinfoComponent } from 'src/app/auth/myinfo/myinfo.component';
import { TopImageComponent } from 'src/app/shared/top-image/top-image.component';
import { CreateNewsComponent } from './create-news/create-news.component';
import { DetailNewsComponent } from './detail-news/detail-news.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsPageRoutingModule
  ],
  declarations: [NewsPage, MyinfoComponent, TopImageComponent, CreateNewsComponent, DetailNewsComponent],
  entryComponents: [MyinfoComponent, TopImageComponent, CreateNewsComponent, DetailNewsComponent],
  exports: [TopImageComponent]
})
export class NewsPageModule {}
