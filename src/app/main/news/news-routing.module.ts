import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsPage } from './news.page';

const routes: Routes = [
  {
    path: '',
    component: NewsPage
  },
/*   {
    path: 'news-details',
    loadChildren: () => import('./news-details/news-details.module').then( m => m.NewsDetailsPageModule)
  }, */
/*   {
    path: 'create-news',
    loadChildren: () => import('./create-news/create-news.module').then( m => m.CreateNewsPageModule)
  }, */
/*   {
    path: 'edit-news',
    loadChildren: () => import('./edit-news/edit-news.module').then( m => m.EditNewsPageModule)
  } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsPageRoutingModule {}
