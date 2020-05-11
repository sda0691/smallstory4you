import { Injectable } from '@angular/core';
import { News } from './News.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private _news = new BehaviorSubject<News[]>([
    new News(
      1,
      1,
      'first news',
      'first note'
    ),
    new News(
      2,
      1,
      'second news',
      '두번재 노트'
    ),
  ]);

  constructor() { }

  // return obervable
  get allNews() {
    return this._news.asObservable();
  }

  // return observable
  getNews(id: number) {
    return this.allNews.pipe(
      take(1),
      map(news => {
        return {...news.find(n => n.id === id)};
      })
    );
    // return this.news.find(p => p.id === id);
  }
  
  postNews(title: string, note: string) {
    const newPost = new News(
      Math.random(),
      1,
      title,
      note
    );
    return this.allNews.pipe(
      take(1),
      delay(1000),
      tap(news => {
        this._news.next(news.concat(newPost));
      })
    );
  }

  editNews(newsId: number, title: string, note: string) {
    return this.allNews.pipe(take(1), delay(1000), tap(news => {
      const updatedNewsIndex = news.findIndex(n => n.id === newsId);
      const updatedNews = [...news];
      const oldNews = updatedNews[updatedNewsIndex];
      updatedNews[updatedNewsIndex] = new News(
        oldNews.id,
        oldNews.groupid,
        title,
        note
      );
      this._news.next(updatedNews);
    }));
  }

  DeleteNews(newsId: number) {
    return this.allNews.pipe(
      take(1),
      delay(1000),
      tap(news => {
        this._news.next(news.filter(n => n.id !== newsId));
      })
    );
  }
}
