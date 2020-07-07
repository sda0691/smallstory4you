import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MembersPageRoutingModule } from './members-routing.module';

import { MembersPage } from './members.page';

import { MemberDetailsComponent } from './member-details/member-details.component';
import { NewsPageModule } from '../news/news.module';
import { MyinfoComponent } from 'src/app/auth/myinfo/myinfo.component';
import { MediasPageModule } from '../medias/medias.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MembersPageRoutingModule,
    MediasPageModule
  ],
  declarations: [MembersPage, MemberDetailsComponent],
  entryComponents: [MemberDetailsComponent]
})
export class MembersPageModule {}
