import { Injectable } from '@angular/core';
import { News } from './News.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  collectionName = GlobalConstants.newsCollection;
  private _news = new BehaviorSubject<News[]>(null);

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  // return obervable
  get news() {
    return this._news.asObservable();
  }
  fetchNews() {
    return this.firestore.collection(this.collectionName, ref => ref.orderBy('whenCreated','desc').limit(500))
    .snapshotChanges()
      .pipe(
        map(docArray => {
          let news = [];
          news = docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              groupid: doc.payload.doc.data()['groupid'],
              groupName: doc.payload.doc.data()['groupName'],
              author: doc.payload.doc.data()['author'],
              note: doc.payload.doc.data()['note'],
              whoCreated: doc.payload.doc.data()['whoCreated'],
              whenCreated: new Date(doc.payload.doc.data()['whenCreated'].seconds * 1000),
              youtubeLink: doc.payload.doc.data()['youtubeLink'],
              viewCount: doc.payload.doc.data()['viewCount'],
              isPublic: doc.payload.doc.data()['isPublic'],
              downloadUrl: doc.payload.doc.data()['downloadUrl'],
              fileName: doc.payload.doc.data()['fileName'] === undefined ? '' : doc.payload.doc.data()['fileName'],
              title: doc.payload.doc.data()['title'] === undefined ? '' : doc.payload.doc.data()['title'],
            };
          });
          return news;
        }),
        tap(news => {
          this._news.next(news);
        })
      );
  }

  // return observable
/*   getNews(id: number) {
    return this.allNews.pipe(
      take(1),
      map(news => {
        return {...news.find(n => n.id === id)};
      })
    );
    // return this.news.find(p => p.id === id);
  } */
  
  add_news(news, fileNames, downloadUrls) {
    return this.authService.loggedUser.pipe(
      take(1),
      map(user => {
        this.firestore.collection(this.collectionName)
        .add({
          groupId: GlobalConstants.groupId,
          groupName: GlobalConstants.groupName,
          title: news.title,
          note: news.note,
          author: user.name,
          whoCreated: user.id,
          whenCreated: new Date(),
          youtubeLink: news.youtubeLink,
          fileName: fileNames,
          downloadUrl: downloadUrls,
          viewCount: 0,
          isPublic: 'public'
        });
      })
    )
  }
  /* postNews(title: string, note: string) {
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
  } */

/*   editNews(newsId: number, title: string, note: string) {
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
  } */

/*   DeleteNews(newsId: number) {
    return this.allNews.pipe(
      take(1),
      delay(1000),
      tap(news => {
        this._news.next(news.filter(n => n.id !== newsId));
      })
    );
  } */


  delete_news(news: News) {
    return this.firestore.doc(this.collectionName + '/' + news.id).delete()
      .then(() => {
        if (news.fileName.length > 0) {
          this.delete_image(news.fileName);
        }
      });
  }

  delete_image(fileName) {
    const storageRef = this.storage.ref(this.collectionName + '/');
    for (const file of fileName) {
      storageRef.child('/' + file).delete();
    }
  }
}
