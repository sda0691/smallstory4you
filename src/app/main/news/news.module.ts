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
import { MediasPageModule } from '../medias/medias.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsPageRoutingModule,
    MediasPageModule
  ],
  declarations: [NewsPage,   CreateNewsComponent, DetailNewsComponent],
  entryComponents: [  CreateNewsComponent, DetailNewsComponent],
})
export class NewsPageModule {}
