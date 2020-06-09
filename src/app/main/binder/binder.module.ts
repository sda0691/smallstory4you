import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BinderPageRoutingModule } from './binder-routing.module';

import { BinderPage } from './binder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BinderPageRoutingModule
  ],
  declarations: [BinderPage]
})
export class BinderPageModule {}
