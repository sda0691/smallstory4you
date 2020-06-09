import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediasPage } from './medias.page';

const routes: Routes = [
  {
    path: '',
    component: MediasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediasPageRoutingModule {}
