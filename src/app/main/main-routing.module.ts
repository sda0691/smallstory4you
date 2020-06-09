import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { AuthGuard } from '../auth/auth.guard';

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
            loadChildren: () => import('./members/members.module').then( m => m.MembersPageModule),
            //canLoad: [AuthGuard]
          },
          {
            path: 'new',
            loadChildren: () => import('./members/create-member/create-member.module').then( m => m.CreateMemberPageModule),
            //canLoad: [AuthGuard]
          },
          {
            path: 'edit/:memberId',
            loadChildren: () => import('./members/edit-member/edit-member.module').then( m => m.EditMemberPageModule),
            //canLoad: [AuthGuard]
          }
        ]
      },
      {
        path: 'binder',
        children: [
          {
            path: '',
            loadChildren: () => import('./binder/binder.module').then( m => m.BinderPageModule)
          }

        ]
      },
      {
        path: 'medias',
        children: [
          {
            path: '',
            loadChildren: () => import('./medias/medias.module').then( m => m.MediasPageModule)
          }

        ]
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
  {
    path: 'medias',
    loadChildren: () => import('./medias/medias.module').then( m => m.MediasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
