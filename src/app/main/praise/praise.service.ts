import { Injectable } from '@angular/core';
import { AuthService } from '../../../app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { GlobalConstants } from 'src/app/common/global-constants';
import { BehaviorSubject } from 'rxjs';
import { Praise, Album } from './praise.model';
import { take, map, tap } from 'rxjs/operators';

import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class PraiseService {
  collectionName = GlobalConstants.praiseCollection;
  collectionName_Album = GlobalConstants.albumCollection;
  private _praise = new BehaviorSubject<Praise[]>(null);
  private _album = new BehaviorSubject<Album[]>(null);
  
  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  get praises() {
    return this._praise.asObservable();
  }
  get albums() {
    return this._album.asObservable();
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
  add_album(albumName, userid) {
    return this.firestore.collection(this.collectionName_Album)
    .add({
      groupId: GlobalConstants.groupId,
      groupName: GlobalConstants.groupName,
      albumName: albumName,
      userid: userid,
      songList : ''
    });
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

  
  getPraiseById(id: string) {
    return this.firestore.collection(this.collectionName).doc(id).snapshotChanges()
      .pipe(map(action => {
        const data = action.payload.data() as Praise;
        return { id, ...data };
    }));
  }
  
  fetchAlbum(userid) {
    return this.firestore.collection(this.collectionName_Album, ref => 
        ref.where('userid', '==', userid)).snapshotChanges()
      .pipe(
        map(docArray => {
          let albums = [];
          albums = docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              userid: doc.payload.doc.data()['userid'],
              albumName: doc.payload.doc.data()['albumName'],
              songList: doc.payload.doc.data()['songList'],
              songList1: doc.payload.doc.data()['songList1'],
              refField: doc.payload.doc.data()['refField'],
            };

          });
          return albums;
        }),
        tap(albums => {
          this._album.next(albums);
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
  updateAlbumSongList(uid, songList) {
     return this.firestore.collection(this.collectionName_Album )
      .doc(uid)
      .set(
        { songList: songList},
        { merge: true }
      );

    /*       
    // should use each item or hardcode array as below.
    return this.firestore.collection(this.collectionName_Album )
      .doc(uid)
      .update(
        { songList: firebase.firestore.FieldValue.arrayUnion('a','b') },
        ); 
    */
  }
  updateAlbumName(albumId, albumName) {
    return this.firestore.collection(this.collectionName_Album )
    .doc(albumId )
    .update({
      albumName: albumName,
    });
  }
  removeAlbum(albumId) {
    return this.firestore.doc(this.collectionName_Album + '/' + albumId).delete();

  }
  removeFromAlbum(albumId, songid) {
    console.log(albumId, songid)
    return this.firestore.collection(this.collectionName_Album )
    .doc(albumId)
    .update(
      { songList: firebase.firestore.FieldValue.arrayRemove(songid) },
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
