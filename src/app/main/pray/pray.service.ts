import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalConstants } from 'src/app/common/global-constants';
import { take, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Pray } from './Pray.model';
import { AngularFireStorage } from '@angular/fire/storage';

interface Date {
  addSeconds: (start: number | undefined) => [Date, Date];
}

@Injectable({
  providedIn: 'root'
})
export class PrayService {
  collectionName = GlobalConstants.prayCollection;
  private _pray = new BehaviorSubject<Pray[]>(null);

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  get prays() {
    return this._pray.asObservable();
  }

  fetchPrays() {
    return this.firestore.collection(this.collectionName, ref => ref.orderBy('dateOfPray', 'desc').limit(50))
      .snapshotChanges()
      .pipe(
        map ( docArray  => {
          let prays = [];
          prays = docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              groupid: doc.payload.doc.data()['groupid'],
              groupName: doc.payload.doc.data()['groupName'],
              dateOfPray: new Date(doc.payload.doc.data()['dateOfPray'].seconds * 1000),
              category: doc.payload.doc.data()['category'],
              title: doc.payload.doc.data()['title'],
              verseOfPray: doc.payload.doc.data()['verseOfPray'],
              word: doc.payload.doc.data()['word'],
              fileName: doc.payload.doc.data()['fileName'],
            }
          })
          return prays;
        }),
        tap (prays => {
          this._pray.next(prays);
        })
      );
  }

  add_pray(pray, fileName) {
    // const userid = this.authService.userId1;
    return this.authService.loggedUser.pipe(
      take(1),
      map(user => {
        const newDate = new Date(pray.dateOfPray);
        newDate.setHours(0, 0, 0, 0);
        this.firestore.collection(this.collectionName)
        .add({
          groupId: this.authService.groupId,
          groupName: GlobalConstants.groupName,
          dateOfPray: newDate , // new Date(pray.dateOfPray),
          title: pray.title,
          verseOfPray: pray.verseOfPray,
          category: pray.category,
          word: pray.word,
          fileName: fileName,
        });
      })
    );
  }
  edit_pray(pray, fileName: string) {
    pray.groupId = this.authService.groupId;
    pray.groupName = GlobalConstants.groupName;
    pray.fileName = fileName;

    return this.firestore.doc(this.collectionName + '/' + pray.id).update(pray);
  }

  delete_pray(pray: Pray) {
    return this.firestore.doc(this.collectionName + '/' + pray.id).delete()
      .then(() => {
        if (pray.fileName.length > 0) {
          this.delete_image(pray.fileName);
        }
      });
  }

  delete_image(filename: string) {
    const storageRef = this.storage.ref(this.collectionName + '/');
    storageRef.child('/' + filename).delete();
  }
}