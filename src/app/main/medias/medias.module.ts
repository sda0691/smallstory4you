import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MediasPageRoutingModule } from './medias-routing.module';

import { MediasPage } from './medias.page';
import { CreateMediaComponent } from './create-media/create-media.component';
import { NewsPageModule } from '../news/news.module';
import { DetailMediaComponent } from './detail-media/detail-media.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MediasPageRoutingModule,
    NewsPageModule  // to include app-top-image component
  ],
  declarations: [MediasPage, CreateMediaComponent, DetailMediaComponent, DetailMediaComponent],
  entryComponents: [CreateMediaComponent, DetailMediaComponent, DetailMediaComponent]
})
export class MediasPageModule {}
