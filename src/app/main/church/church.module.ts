import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChurchPageRoutingModule } from './church-routing.module';

import { ChurchPage } from './church.page';
import { MediasPageModule } from '../medias/medias.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChurchPageRoutingModule,
    MediasPageModule
  ],
  declarations: [ChurchPage]
})
export class ChurchPageModule {}
