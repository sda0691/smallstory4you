import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: MainPage,
    children: [
      {
        path: 'news',
        children: [
          {
            path: '',
            loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule)
          },
          {
            // new should be before :newsId
            path: 'new',
            loadChildren: () => import('./news/create-news/create-news.module').then( m => m.CreateNewsPageModule)
          },
          {
            // new should be before :newsId
            path: 'edit/:newsId',
            loadChildren: () => import('./news/edit-news/edit-news.module').then( m => m.EditNewsPageModule)
          },
          {
            path: ':newsId',
            loadChildren: () => import('./news/news-details/news-details.module').then( m => m.NewsDetailsPageModule)
          },
        ]
      },
      {
        path: 'bands',
        children: [
          {
            path: '',
            loadChildren: () => import('./bands/bands.module').then( m => m.BandsPageModule)
          }

        ]
      },
      {
        path: 'members',
        children: [
          {
            path: '',
            loadChildren: () => import('./members/members.module').then( m => m.MembersPageModule)
          },
          {
            path: 'new',
            loadChildren: () => import('./members/create-member/create-member.module').then( m => m.CreateMemberPageModule)
          },
          {
            path: 'edit/:memberId',
            loadChildren: () => import('./members/edit-member/edit-member.module').then( m => m.EditMemberPageModule)
          }
        ]
      },
      {

      },
      {
        path: '',
        redirectTo: '/main/tabs/news',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/main/tabs/news',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
