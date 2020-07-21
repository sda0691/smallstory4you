import { Injectable } from '@angular/core';
import { AuthService } from '../../../app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { GlobalConstants } from 'src/app/common/global-constants';
import { BehaviorSubject } from 'rxjs';
import { Praise } from './praise.model';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PraiseService {
  collectionName = GlobalConstants.praiseCollection;
  private _praise = new BehaviorSubject<Praise[]>(null);
  
  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  get praises() {
    return this._praise.asObservable();
  }

  add_praise(praise, fileName, downloadUrl) {
    return this.authService.loggedUser.pipe(
      take(1),
      map(user => {
        this.firestore.collection(this.collectionName)
        .add({
          groupId: GlobalConstants.groupId,
          groupName: GlobalConstants.groupName,
          title: praise.title,
          singer: praise.singer,
          genre: praise.genre,
          category: praise.category,
          youtubeLink: praise.youtubeLink ,
          format: praise.format,
          fileName: fileName,
          downloadUrl: downloadUrl,
          viewCount: 0,
          whoCreated: user.id,
          whenCreated: new Date(),
          whoUpdated: user.id,
          whenUpdated: new Date(),
        });
      })
    );
  }
  fetchMembers() {
    return this.firestore.collection(this.collectionName, ref => ref.orderBy('whenCreated', 'desc')).snapshotChanges()
      .pipe(
        map(docArray => {
          let members = [];
          members = docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              groupid: doc.payload.doc.data()['groupid'],
              groupName: doc.payload.doc.data()['groupName'],
              title: doc.payload.doc.data()['title'],
              singer: doc.payload.doc.data()['singer'],
              genre: doc.payload.doc.data()['genre'],
              format: doc.payload.doc.data()['format'],
              category: doc.payload.doc.data()['category'],
              youtubeLink: doc.payload.doc.data()['youtubeLink'],
              fileName: doc.payload.doc.data()['fileName'] === undefined ? '' : doc.payload.doc.data()['fileName'],
              downloadUrl: doc.payload.doc.data()['downloadUrl'] === undefined ? '' : doc.payload.doc.data()['downloadUrl'],
              viewCount: doc.payload.doc.data()['viewCount'] === undefined ? '' : doc.payload.doc.data()['viewCount'],
              whoCreated: doc.payload.doc.data()['whoCreated'],
            };

          });
          return members;
        }),
        tap(praise => {
          this._praise.next(praise);
        })
      );
  }

  edit_praise(praise, fileName: string) {
    return this.authService.loggedUser.pipe(
      take(1),
      map(user => {
        if (user && user.role.toUpperCase() === 'ADMIN') {
          this.firestore.doc(this.collectionName + '/' + praise.id).update(praise);
        }
      })
    );
  }

  delete_praise(praise: Praise) {
    return this.firestore.doc(this.collectionName + '/' + praise.id).delete()
      .then(() => {
        if (praise.fileName.length > 0) {
          this.delete_image(praise.fileName);
        }
      });
  }

  delete_image(filename: string) {
    const storageRef = this.storage.ref(this.collectionName + '/');
    storageRef.child('/' + filename).delete();
  }
}
