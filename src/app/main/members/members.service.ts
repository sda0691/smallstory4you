import { Injectable, OnInit } from '@angular/core';
import { Member } from './member.model';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { take, delay, map, tap, finalize } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

export interface fileInfo{
  filepath: string;
}


@Injectable({
  providedIn: 'root'
})
export class MembersService implements OnInit {
  messageData: any = [];

  studentsRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  studentRef: AngularFireObject<any>;
  collectionName = 'Members';
  // Snapshot of uploading file
  snapshot: Observable<any>;
  // Uploaded File URL
  uploadedFileURL: Observable<string>;


  // this.imageCollection = database.collection<MyData>('freakyImages');

  isUploading: boolean;
  isUploaded: boolean;
  fileName: string;

  uploadedFilePath: any;

  // Upload Task 
  task: AngularFireUploadTask;

  private groupId = 1;
  private _members = new BehaviorSubject<Member[]>([

   new Member (
      '1',
      this.groupId,
      'john park',
      '647-234-9707',
      'https://randomuser.me/api/portraits/women/3.jpg',
      '40 lebovic dr richmond hill ON',
      'dfdf'
   ),
   new Member (
    '2',
    this.groupId,
    'john park',
    '647-234-9707',
    'https://randomuser.me/api/portraits/women/24.jpg',
    '40 lebovic dr richmond hill ON',
    'dfdf'
    ),
  ]);

 
constructor(
  private firestore: AngularFirestore,
  private storage: AngularFireStorage
  ) { }

  ngOnInit() {}

  add_member(member) {

    return this.firestore.collection(this.collectionName)
      .add({
        groupId: this.groupId,
        name: member.name,
        phone1: member.phone1,
        imageUrl: member.imageUrl,
        address: member.address,
        fileName: member.fileName
      });
  }

  get_members() {
    return this.firestore.collection(this.collectionName).snapshotChanges();


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

  uploadImage(member, isEdit: boolean, file?: File) {
    // this.baseStorgePath = this.baseStorgePath + file.name;

    const storageFolderName = 'Members/';
    const uploadedFileName = `${new Date().getTime()}_${file.name}`;
    const fullPath = storageFolderName + uploadedFileName;
    const fileRef = this.storage.ref(fullPath);
    const customMetadata = { app: 'Freaky Image Upload Demo' };
    const oldFileName = member.fileName;

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
            this.add_member(member);
          }
        }, error => {
          console.error(error);
        });
      })
    );
    // simple way to get downloadUrl;
    // this.downloadURL = this.afStorage.ref('/users/davideast.png').getDownloadURL();
  }

  deleteMember(member: Member) {
    this.delete_database(member.id)
      .then(() => {
        // const storageRef = this.storage.ref('Members/');
        // storageRef.child('/' + member.fileName).delete();
        this.delete_image(member.fileName);
      })
      .catch(error => console.log(error));
  }

  delete_database(id) {
    return this.firestore.doc(this.collectionName + '/' + id).delete();
  }

  delete_image(filename: string) {
    const storageRef = this.storage.ref('Members/');
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


  get members() {
    return this._members.asObservable();
  }

/*   getMember(id: number) {
    return this.members.pipe(
      take(1),
      map(members => {
        return {...members.find(m => m.id === id)};
      })
    );
  } */

  AddMember_Old(name: string, phone: string, address: string) {
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
  }

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
