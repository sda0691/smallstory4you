import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BandsPage } from './bands.page';

const routes: Routes = [
  {
    path: '',
    component: BandsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BandsPageRoutingModule {}
