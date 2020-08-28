import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PraisePageRoutingModule } from './praise-routing.module';

import { PraisePage } from './praise.page';
import { CreatePraiseComponent } from './create-praise/create-praise.component';
import { MediasPageModule } from '../medias/medias.module';
import { EditPraiseComponent } from './edit-praise/edit-praise.component';
import { AlbumComponent } from './album/album.component';
import { NewAlbumComponent } from './new-album/new-album.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PraisePageRoutingModule,
    MediasPageModule
  ],
  declarations: [PraisePage, CreatePraiseComponent, EditPraiseComponent, AlbumComponent, NewAlbumComponent],
  entryComponents: [CreatePraiseComponent, EditPraiseComponent, AlbumComponent, NewAlbumComponent]
})
export class PraisePageModule {}
