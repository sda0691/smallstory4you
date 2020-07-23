import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Member } from './member.model';
import { BehaviorSubject, Observable, pipe, Subscription } from 'rxjs';
import { take, delay, map, tap, finalize, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AuthService } from 'src/app/auth/auth.service';
import { GlobalConstants } from '../../common/global-constants';
import { MemberUploadInfo } from './MemberUploadInfo.model';
import { HttpClient } from '@angular/common/http';


export interface fileInfo {
  filepath: string;
}

interface MemberModel {
  id: string;
  groupId: number;
  groupName: string;
  name: string;
  phone1: string;
  imageUrl: string;
  address: string;
  fileName: string;
  whoCreated: string;
  whoUpdated: string;
  whenCreated: Date;
  whenUpdated: Date;
}
@Injectable({
  providedIn: 'root'
})
export class MembersService implements OnInit, OnDestroy {
  messageData: any = [];

  studentsRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  studentRef: AngularFireObject<any>;
  collectionName = GlobalConstants.memberCollection;
  // Snapshot of uploading file
  snapshot: Observable<any>;
  // Uploaded File URL
  uploadedFileURL: Observable<string>;
  private _MemberUploadInfo = new BehaviorSubject<MemberUploadInfo>(null);

  // this.imageCollection = database.collection<MyData>('freakyImages');

  isUploading: boolean;
  isUploaded: boolean;
  fileName: string;

  uploadedFilePath: any;

  // Upload Task 
  task: AngularFireUploadTask;

  private _members = new BehaviorSubject<Member[]>(null);


  members1: Observable<any>;
  private subs: Subscription[] = [];

constructor(
  private firestore: AngularFirestore,
  private storage: AngularFireStorage,
  private authService: AuthService,
  private http: HttpClient
  ) { }

  ngOnInit() {
  }
  get members() {
    return this._members.asObservable();
  }
  get memberUploadInfo() {
    return this._MemberUploadInfo.asObservable();
  }
    
  add_member(member, fileName, downloadUrl) {
    // const userid = this.authService.userId1;
    return this.authService.loggedUser.pipe(
      take(1),
      map(user => {
        if (user && user.role.toUpperCase() === 'ADMIN') {
          this.firestore.collection(this.collectionName)
          .add({
            groupId: this.authService.groupId,
            groupName: GlobalConstants.groupName,
            name: member.name,
            phone1: member.phone1,
            imageUrl: downloadUrl,
            address: member.address,
            fileName: fileName,
            whoCreated: user.id,
            whenCreated: new Date(),
            homePhone: member.homePhone,
            businessPhone: member.businessPhone,
            dateOfBirth: new Date(),
            status: '출석',
            familyMember: '',
            ageStatus: member.ageStatus
          });
        }
        // return user;
      }));
  }
  fetchMembers() {
    return this.firestore.collection(this.collectionName, ref => ref.orderBy('name')).snapshotChanges()
      .pipe(
        map(docArray => {
          let members = [];
          members = docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              groupid: doc.payload.doc.data()['groupid'],
              groupName: doc.payload.doc.data()['groupName'],
              name: doc.payload.doc.data()['name'],
              phone1: doc.payload.doc.data()['phone1'],
              imageUrl: doc.payload.doc.data()['imageUrl'],
              address: doc.payload.doc.data()['address'],
              fileName: doc.payload.doc.data()['fileName'],
              homePhone: doc.payload.doc.data()['homePhone'] === undefined ? '' : doc.payload.doc.data()['homePhone'],
              businessPhone: doc.payload.doc.data()['businessPhone'] === undefined ? '' : doc.payload.doc.data()['businessPhone'],
              ageStatus: doc.payload.doc.data()['ageStatus'] === undefined ? '' : doc.payload.doc.data()['ageStatus'],
            };

          });
          return members;
        }),
        tap(members => {
          this._members.next(members);
        })
      );
  }
  get_members() {
    /* const dataUrl = 'https://firestore.googleapis.com/v1/projects/smallstory4you/databases/(default)/documents/WTK-CANADA-MEMBER';
    return this.http.get<MemberModel>(dataUrl)
    .pipe(
      map(resData => {
        const test = resData;
        const members = [];
        // tslint:disable-next-line: forin
        for (const key in test) {
          if (resData.hasOwnProperty(key)) {
            members.push(
              new Member(
                key,
                resData[key].groupId,
                resData[key].groupName,
                resData[key].name,
                resData[key].phone1,
                resData[key].imageUrl,
                resData[key].address,
                resData[key].fileName,
                resData[key].whoCreated,
                resData[key].whoUpdated,
                new Date(resData[key].whenCreated),
                new Date(resData[key].whenUpdated)
              )
            );
          }
        }
        return members;
      })
    ); */
    const fetchedUserId = this.authService.userId1;
    if (fetchedUserId) {
      // return this.firestore.collection(this.collectionName).doc(fetchedUserId).snapshotChanges();
    }
    this.members1 = this.firestore.collection(this.collectionName, ref => ref.orderBy('name', 'desc')).snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              groupid: doc.payload.doc.data()['groupid'],
              groupName: doc.payload.doc.data()['groupName'],
              name: doc.payload.doc.data()['name'],
              phone1: doc.payload.doc.data()['phone1'],
              imageUrl: doc.payload.doc.data()['imageUrl'],
              address: doc.payload.doc.data()['address'],
              fileName: doc.payload.doc.data()['fileName']   
            };
          });
        })
      );

    return this.members1;
  }

  get_member(id){
    // #1 works
    /* return this.firestore.collection(this.collectionName).snapshotChanges()
      .pipe(
        take(1),
        map(members => {
          return {...members.find(m => m.payload.doc.id === id)};
        })
      ); */

    // #2 works
    return this.firestore.collection(this.collectionName).doc(id).snapshotChanges()
      .pipe(map(action => {
        const data = action.payload.data() as Member;
        // const memberId = action.payload.id;
        return { id, ...data };
    }));
  }

  edit_member( member, fileName: string) {
    const userid = this.authService.userId1;
    return this.authService.loggedUser.pipe(
      take(1),
      map(user => {
        if (user && user.role.toUpperCase() === 'ADMIN') {

          this.firestore.doc(this.collectionName + '/' + member.id).update(member);
/*           this.firestore.doc(this.collectionName + '/' + member.id).update({
            name: member.name,
            phone1: member.phone1,
            homePhone: member.homePhone,
            businessPhone: member.businessPhone,
            fileName: fileName,
            address: member.address,
            ageStatus: member.ageStatus,
            dateOfBirth: new Date(), // member.dateOfBirth,
            familyMember: '' , // member.familyMember,
            groupId : this.authService.groupId,
            groupName : GlobalConstants.groupName,
            whoUpdated : userid,
            whenUpdated : new Date(),
            status: '' // member.status,
          }); */
        }
      })
    );
  }

/*   uploadImage1(file?: File): AngularFireUploadTask {

    const storageFolderName = GlobalConstants.memberCollection + '/'; // 'Members/';
    const uploadedFileName = `${new Date().getTime()}_${file.name}`;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    
    return fileRef.put(file);
  } */

  /* uploadImage(member, isEdit: boolean, file?: File) {
    // this.baseStorgePath = this.baseStorgePath + file.name;

    const storageFolderName = GlobalConstants.memberCollection + '/'; // 'Members/';
    const uploadedFileName = `${new Date().getTime()}_${file.name}`;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    const customMetadata = { app: 'Freaky Image Upload Demo' };
    const oldFileName = member.fileName;
    // this._MemberUploadInfo.next(null);

    this.task = this.storage.upload( fullPath, file, {customMetadata});


    return this.task.snapshotChanges().pipe(
      finalize(() => {
        // Get uploaded file storage path
        this.uploadedFileURL = fileRef.getDownloadURL();
        this.uploadedFileURL.subscribe(resp => {
          this.uploadedFilePath = resp;
          member.fileName = uploadedFileName;
          member.imageUrl = resp;

          if (isEdit) {
            console.log('edit member');
            this.edit_member(member);
            console.log('image delete before new image upload');
            this.delete_image(oldFileName);
          } else {
            this.add_member(member, '');
          } 
        }, error => {
          console.error(error);
        });
      })
    );
  } */

  deleteMember(member: Member) {
 
    if (member.fileName.length > 0) {
      this.delete_image(member.fileName);
    }
    this.delete_database(member.id);


  }

  delete_database(id) {
    return this.firestore.doc(this.collectionName + '/' + id).delete();
  }

  delete_image(filename: string) {
    const fullPath = this.collectionName + '/' + filename;
    const fileRef = this.storage.ref(fullPath);

    this.subs.push(fileRef.getDownloadURL()
    .subscribe(url => {
      const storageRef = this.storage.ref(this.collectionName + '/');
      storageRef.child('/' + filename).delete();
      console.log(url);
    }, error => {
      console.log(error);
    }));
  }

  deletePhoto(member, fileName) {
    this.delete_image(fileName);
    member.fileName = '';
    member.imageUrl = '';
    this.firestore.doc(this.collectionName + '/' + member.id).update(member);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
