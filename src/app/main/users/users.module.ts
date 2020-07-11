import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MediasPageModule } from '../medias/medias.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    MediasPageModule
  ],
  declarations: [UsersPage, EditUserComponent],
  entryComponents: [EditUserComponent]
})
export class UsersPageModule {}
