import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MembersPageRoutingModule } from './members-routing.module';

import { MembersPage } from './members.page';

import { MemberDetailsComponent } from './member-details/member-details.component';
import { NewsPageModule } from '../news/news.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MembersPageRoutingModule,
    NewsPageModule
  ],
  declarations: [MembersPage, MemberDetailsComponent],
  entryComponents: [MemberDetailsComponent]
})
export class MembersPageModule {}
