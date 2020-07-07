import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { GlobalConstants } from 'src/app/common/global-constants';
import { AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map, tap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Media } from './media.model';
import { AngularFireList } from '@angular/fire/database';
import { UpperCasePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MdeiaService {
  mediaRef: AngularFireList<any>;
  
  collectionName = GlobalConstants.mediaCollection;
  private _medias = new BehaviorSubject<Media[]>(null);
  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  get medias() {
    return this._medias.asObservable();
  }

  fetchMedias(category) {
/*     const storageFolderName = GlobalConstants.mediaCollection + '/'; // 'Members/';
    const uploadedFileName = `${new Date().getTime()}_${this.pickedFile.name}`;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath); */
    let query: AngularFirestoreCollection;
    if (category.toUpperCase() !== 'ALL') {
      query = this.firestore.collection<Media[]>(this.collectionName, ref => 
        ref.where('category', '==', category).orderBy('dateOfMedia','desc').limit(500));
    } else {
      query = this.firestore.collection(this.collectionName, ref => ref.orderBy('dateOfMedia','desc').limit(500));
    }

    // return this.firestore.collection(this.collectionName).snapshotChanges()
    return query.snapshotChanges()
      .pipe(
        map(docArray => {

          let medias = [];
          medias = docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              groupid: doc.payload.doc.data()['groupid'],
              groupName: doc.payload.doc.data()['groupName'],
              author: doc.payload.doc.data()['author'],
              title: doc.payload.doc.data()['title'],
              subTitle: doc.payload.doc.data()['subTitle'],
              dateOfMedia: doc.payload.doc.data()['dateOfMedia'] === undefined ? undefined : 
                new Date(doc.payload.doc.data()['dateOfMedia'].seconds * 1000),
              fileName: doc.payload.doc.data()['fileName'],
              category: doc.payload.doc.data()['category'],
              whenCreated: new Date(doc.payload.doc.data()['whenCreated'].seconds * 1000),
              // whenCreated: doc.payload.doc.data()['whenCreated'],

              downloadUrl: doc.payload.doc.data()['downloadUrl'],
              youtubeLink: doc.payload.doc.data()['youtubeLink'] === undefined ? '' : doc.payload.doc.data()['youtubeLink'],
            };

          });
          return medias;
        }),
        tap(medias => {
          this._medias.next(medias);
        })
      );
  }

  add_media(media, fileName) {
    // const userid = this.authService.userId1;
    return this.authService.loggedUser.pipe(
      take(1),
      map(user => {
        const newDate = new Date(media.dateOfMedia);
        newDate.setHours(0, 0, 0, 0);
        this.firestore.collection(this.collectionName)
        .add({
          groupId: this.authService.groupId,
          groupName: GlobalConstants.groupName,
          author: media.author,
          title: media.title,
          subTitle: media.subTitle,
          dateOfMedia: newDate ,
          fileName: fileName,
          category: media.category,
          downloadUrl: '',
          whoCreated: user.id,
          whenCreated: new Date(),
          youtubeLink: media.youtubeLink
        });
      })
    )
/*     return this.firestore.collection(this.collectionName)
    .add({
      groupId: this.authService.groupId,
      groupName: GlobalConstants.groupName,
      author: media.author,
      title: media.title,
      subTitle: media.subTitle,
      fileName: fileName,
      category: media.category,
      downloadUrl: '',
      whoCreated: userid,
      whenCreated: new Date()
    }); */
  }
  
  edit_media(media, fileName: string) {
    const userid = this.authService.userId1;
    media.groupId = this.authService.groupId;
    media.groupName = GlobalConstants.groupName;
    media.fileName = fileName;
    media.downloadUrl = '';
    media.whoUpdated = userid;
    media.whenUpdated = new Date();
    media.youtubeLink = media.youtubeLink;

    return this.firestore.doc(this.collectionName + '/' + media.id).update(media);
  }

  delete_media(media: Media) {
    return this.firestore.doc(this.collectionName + '/' + media.id).delete()
      .then(() => {
        if (media.fileName.length > 0) {
          this.delete_image(media.fileName);
        }
      });
  }

  delete_image(filename: string) {
    const storageRef = this.storage.ref(this.collectionName + '/');
    storageRef.child('/' + filename).delete();
  }
}
