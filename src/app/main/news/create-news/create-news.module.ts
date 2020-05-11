import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewsPageRoutingModule } from './create-news-routing.module';

import { CreateNewsPage } from './create-news.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CreateNewsPageRoutingModule
  ],
  declarations: [CreateNewsPage]
})
export class CreateNewsPageModule {}
