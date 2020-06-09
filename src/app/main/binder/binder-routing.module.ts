import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BinderPage } from './binder.page';

const routes: Routes = [
  {
    path: '',
    component: BinderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BinderPageRoutingModule {}
