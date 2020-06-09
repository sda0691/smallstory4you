import { Injectable, OnInit } from '@angular/core';
import { Member } from './member.model';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
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
export class MembersService implements OnInit {
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
  /* add_member(member) {
    let fetchedUserId: string;
    let fetchedUploadUrl: string;
    let fetchedFileUrl: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('no user found');
        }
        fetchedUserId = userId;
        return userId;
      }),
      take(1),
      switchMap(uploadUrl => {
        fetchedUploadUrl = uploadUrl;
        return uploadUrl;
      }),
      take(1),
      switchMap(fileUrl => {
        fetchedFileUrl = fileUrl;
        return fileUrl;
      }),
      take(1),
      switchMap(() => {
        return this.firestore.collection(this.collectionName)
          .add({
            groupId: this.authService.groupId,
            groupName: GlobalConstants.groupName,
            name: member.name,
            phone1: member.phone1,
            imageUrl: fetchedUploadUrl,
            address: member.address,
            fileName: fetchedFileUrl,
            whoCreated: fetchedUserId,
            whenCreated: new Date()
          });
      })
    );
  } */
  add_member(member) {
    const userid = this.authService.userId1;
    return this.firestore.collection(this.collectionName)
        .add({
          groupId: this.authService.groupId,
          groupName: GlobalConstants.groupName,
          name: member.name,
          phone1: member.phone1,
          imageUrl: member.imageUrl,
          address: member.address,
          fileName: member.fileName,
          whoCreated: userid,
          whenCreated: new Date()
        });

    /* return this.authService.userId.pipe(
      take(1),
      tap(userid => {
        return this.firestore.collection(this.collectionName)
        .add({
          groupId: this.authService.groupId,
          groupName: GlobalConstants.groupName,
          name: member.name,
          phone1: member.phone1,
          imageUrl: member.imageUrl,
          address: member.address,
          fileName: member.fileName,
          whoCreated: userid,
          whenCreated: new Date()
        })
      }), */
    
    //)
    
  }
  fetchMembers() {
    return this.firestore.collection(this.collectionName).snapshotChanges()
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
              fileName: doc.payload.doc.data()['fileName']   
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
    this.members1 = this.firestore.collection(this.collectionName).snapshotChanges()
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

    /* return this.firestore.collection(this.collectionName)
      .snapshotChanges()
      .pipe(
        map(resData => {
          const members = [];
          for (const key in resData) {
            if(resData.hasOwnProperty(key)) {
              members.push(
                new Member(
                  key,
                  resData[key].groupid,
                  resData[key].name,
                  resData[key].phone1,
                  resData[key].imageUrl,
                  resData[key].address
                )
              )
            }
          }
        })
      ) */
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

  edit_member( member) {
    return this.firestore.doc(this.collectionName + '/' + member.id).update(member);
  }

  uploadImage1(file?: File): AngularFireUploadTask {

    const storageFolderName = GlobalConstants.memberCollection + '/'; // 'Members/';
    const uploadedFileName = `${new Date().getTime()}_${file.name}`;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    
    return fileRef.put(file);
  }

  uploadImage(member, isEdit: boolean, file?: File) {
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
/*           const uploadInfo = new MemberUploadInfo(
            resp,
            uploadedFileName
          ); */
        // this._MemberUploadInfo.next(uploadInfo);
        
          if (isEdit) {
            console.log('edit member');
            this.edit_member(member);
            console.log('image delete before new image upload');
            this.delete_image(oldFileName);
          } else {
            this.add_member(member);
          } 
        }, error => {
          console.error(error);
        });
      })
    );
  }

  deleteMember(member: Member) {
    this.delete_database(member.id)
      .then(() => {
        // const storageRef = this.storage.ref('Members/');
        // storageRef.child('/' + member.fileName).delete();
        if (member.imageUrl.length > 0) {
          this.delete_image(member.fileName);
        }
      })
      .catch(error => console.log(error));
  }

  delete_database(id) {
    return this.firestore.doc(this.collectionName + '/' + id).delete();
  }

  delete_image(filename: string) {
    const storageRef = this.storage.ref(this.collectionName + '/');
    storageRef.child('/' + filename).delete();
  }

  AddStudent(member: Member) {
    this.studentsRef.push({
      groupid: 1,
      name: member.name,
      phone1: 'rrr',
      imageUrl: 'test',
      address: member.address,
    });
  }



/*   getMember(id: number) {
    return this.members.pipe(
      take(1),
      map(members => {
        return {...members.find(m => m.id === id)};
      })
    );
  } */

/*   AddMember_Old(name: string, phone: string, address: string) {
    const newMember = new Member(
      'aaa', // Math.floor((Math.random() * 101)),
      this.groupId,
      name,
      phone,
      'https://randomuser.me/api/portraits/women/24.jpg',
      address,
      'dfdf'
    );
    return this.members.pipe(
      take(1),
      delay(1000),
      tap(members => {
        this._members.next(members.concat(newMember));
      })
    );
  } */

  /* EditMember(memberId: string, name: string, phone: string, address: string) {
    return this.members.pipe(
      take(1),
      delay(1000),
      tap(members => {
        const updatedMemberIndex = members.findIndex(m => m.id === memberId);
        const updatedMembers = [...members];
        const oldMember = updatedMembers[updatedMemberIndex];
        updatedMembers[updatedMemberIndex] = new Member(
          memberId,
          oldMember.groupid,
          name,
          phone,
          'https://randomuser.me/api/portraits/women/24.jpg',
          address
        );
        this._members.next(updatedMembers);
      })
    );
  } */

  // Store to Firebase: Cloud Firestore






}
