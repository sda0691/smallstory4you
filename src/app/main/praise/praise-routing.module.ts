import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PraisePage } from './praise.page';

const routes: Routes = [
  {
    path: '',
    component: PraisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PraisePageRoutingModule {}
