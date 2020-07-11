import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrayPage } from './pray.page';

const routes: Routes = [
  {
    path: '',
    component: PrayPage
  },
  {
    path: 'pray-list',
    loadChildren: () => import('./pray-list/pray-list.module').then( m => m.PrayListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrayPageRoutingModule {}
