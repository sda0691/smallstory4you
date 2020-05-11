import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMemberPageRoutingModule } from './create-member-routing.module';

import { CreateMemberPage } from './create-member.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMemberPageRoutingModule
  ],
  declarations: [CreateMemberPage]
})
export class CreateMemberPageModule {}
