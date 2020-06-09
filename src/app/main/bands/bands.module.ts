import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BandsPageRoutingModule } from './bands-routing.module';

import { BandsPage } from './bands.page';
import { NewsPageModule } from '../news/news.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BandsPageRoutingModule,
    NewsPageModule
  ],
  declarations: [BandsPage]
})
export class BandsPageModule {}
