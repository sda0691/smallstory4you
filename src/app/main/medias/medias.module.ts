import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MediasPageRoutingModule } from './medias-routing.module';

import { MediasPage } from './medias.page';
import { CreateMediaComponent } from './create-media/create-media.component';
import { NewsPageModule } from '../news/news.module';
import { DetailMediaComponent } from './detail-media/detail-media.component';
import { MyinfoComponent } from 'src/app/auth/myinfo/myinfo.component';
import { AuthComponent } from 'src/app/auth/auth.component';
import { TopImageComponent } from 'src/app/shared/top-image/top-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MediasPageRoutingModule,
  ],
  declarations: [
    MediasPage, 
    CreateMediaComponent, 
    DetailMediaComponent, 
    TopImageComponent,
    MyinfoComponent,
    AuthComponent
  ],
  entryComponents: [
    CreateMediaComponent, 
    DetailMediaComponent, 
    TopImageComponent,
    MyinfoComponent,
    AuthComponent
  ],
  exports: [TopImageComponent]
})
export class MediasPageModule {}
