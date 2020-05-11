import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MembersPage } from './members.page';

const routes: Routes = [
  {
    path: '',
    component: MembersPage
  },
  {
    path: 'create-member',
    loadChildren: () => import('./create-member/create-member.module').then( m => m.CreateMemberPageModule)
  },
  {
    path: 'edit-member',
    loadChildren: () => import('./edit-member/edit-member.module').then( m => m.EditMemberPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersPageRoutingModule {}
