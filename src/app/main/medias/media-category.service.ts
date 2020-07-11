import { Injectable } from '@angular/core';
import { MediaCategory } from './media-category.model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaCategoryService {

  collectionName = GlobalConstants.mediaCategoryCollection;
  private _mediaCategory = new BehaviorSubject<MediaCategory[]>(null);
  constructor(
    // private authService: AuthService,
    private firestore: AngularFirestore,
    // private storage: AngularFireStorage,
  ) { }

  get mediaCategory() {
    return this._mediaCategory.asObservable();
  }

  fetchMediaCategory() {
        return this.firestore.collection(this.collectionName, ref => 
          ref.orderBy('Id', 'asc')).snapshotChanges()
          .pipe(
            map(docArray => {
              let medias = [];
              medias = docArray.map(doc => {
                return {
                  id: doc.payload.doc.id,
                  name: doc.payload.doc.data()['name'],
                };
              });
              return medias;
            }),
            tap(medias => {
              this._mediaCategory.next(medias);
            })
          );
      }
}
