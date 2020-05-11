import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMemberPage } from './create-member.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMemberPageRoutingModule {}
