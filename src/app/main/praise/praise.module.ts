import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PraisePageRoutingModule } from './praise-routing.module';

import { PraisePage } from './praise.page';
import { CreatePraiseComponent } from './create-praise/create-praise.component';
import { MediasPageModule } from '../medias/medias.module';
import { EditPraiseComponent } from './edit-praise/edit-praise.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PraisePageRoutingModule,
    MediasPageModule
  ],
  declarations: [PraisePage, CreatePraiseComponent, EditPraiseComponent],
  entryComponents: [CreatePraiseComponent, EditPraiseComponent]
})
export class PraisePageModule {}
