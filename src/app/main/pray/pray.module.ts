import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrayPageRoutingModule } from './pray-routing.module';

import { PrayPage } from './pray.page';
import { CreatePrayComponent } from './create-pray/create-pray.component';
import { DetailPrayComponent } from './detail-pray/detail-pray.component';
import { EditPrayComponent } from './edit-pray/edit-pray.component';
import { MyinfoComponent } from 'src/app/auth/myinfo/myinfo.component';
import { AuthComponent } from 'src/app/auth/auth.component';
import { MediasPageModule } from '../medias/medias.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayPageRoutingModule,
    MediasPageModule
  ],
  declarations: [PrayPage, CreatePrayComponent, DetailPrayComponent, EditPrayComponent],
  entryComponents: [CreatePrayComponent, DetailPrayComponent, EditPrayComponent]
})
export class PrayPageModule {}
