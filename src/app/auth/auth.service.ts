import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { User } from './user.model';
import { Plugins } from '@capacitor/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { GlobalConstants } from '../common/global-constants';


export interface AuthResponseData {
  knid: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}
export interface AuthResponseData1 {
  idToken: string;
  email: string;
  refreshToken: string;
  uid: string;
  expiresIn: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{

  private _user = new BehaviorSubject<User>(null);
  private _users = new BehaviorSubject<User[]>(null); // begin used in users page
  private user: User;

  private activeLogoutTimer: any;
  userCollectionName = GlobalConstants.userCollection;
  // private _userId = 'abc';
  testUser: any;
  get loggedUser() {
    // return [...this._places];
    return this._user.asObservable(); // return subscribable data
  }

  get users() {
    return this._users.asObservable();
  }

  get groupId() {
    return 1;
  }
  get groupName() {
    return 'WTK-CANADA';

  }
  get userId() {
    return this._user.asObservable()
      .pipe(map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      }
      ));
  }
  get userId1() {
    if (this.user && this.user.id.length > 0) {
      return this.user.id;
    } else {
      return null;
    }
  }

/*   get userIsAuthenticated() {
    if (this.user && this.user.id.length > 0) {
      return this.user.tokenDuration > 0;
    } else {
      return false;
    }
  } */
  get userIsAuthenticated() {
    return this._user.asObservable()
      .pipe(map(user => {
        if (user) {
          // return (user.tokenDuration > 0);
          return !!user._token;
        } else {
          return false;
        }
      }
      ));
  }
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private alertCtrl: AlertController
  ) { 
    this.fireAuth.authState.subscribe(user => {
      if (user) {

      } else {

      }
    });
  }

  fetchUsers() {
    return this.firestore.collection(this.userCollectionName, ref => ref.orderBy('name', 'asc')).snapshotChanges()
      .pipe(
        map(docArray => {
          let users = [];
          users = docArray.map(doc => {
            return {
              id: doc.payload.doc.data()['id'],
              email: doc.payload.doc.data()['email'],
              name: doc.payload.doc.data()['name'],
              role: doc.payload.doc.data()['role'],
            }
          });
          return users;
        }),
        tap(users => {
          this._users.next(users);
        })
      );
  }
  autoLogin() {
    return from(Plugins.Storage.get({ key: '_cap_authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
          name: string;
          role: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
/*         if (expirationTime <= new Date()) {
          return null;
        } */ // always keep user info but userIsAuth = false based on expirationTime;
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime,
          parsedData.name,
          parsedData.role
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
  
          // this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }
  // return this.firestore.doc(this.collectionName + '/' + media.id).update(media);
  updateRole(uid, role: string) {
    return this.firestore.collection(this.userCollectionName ).doc(uid ).update({
      role: role
    });
  }
  resetPassword(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }
  // return observable: not being used;
  getCurrentUser1(): any {
    const userObservable = new Observable(observer => {
      this.fireAuth.onAuthStateChanged(user => {
        if (user) {
          const loggedUser = user;
          this.firestore.collection(this.userCollectionName).doc(user.uid)
            .get()
            .subscribe(doc => {
              const loggedUserDetail = doc.data() as User;
              const user = new User(
                loggedUser.uid,
                loggedUser.email,
                loggedUserDetail._token,
                loggedUserDetail.tokenExpirationDate,
                loggedUserDetail.name,
                loggedUserDetail.role
              );
              this._user.next(user);
              observer.next(user);
            });

        } else {
          this._user.next(null);
          observer.next(null);
        }
      });
    });
    return userObservable;
  }
  getCurrentUser(): any {
    const userObservable = new Observable(observer => {
      this.fireAuth.onAuthStateChanged(user => {
        if (user) {
          this.firestore.collection(this.userCollectionName).doc(user.uid)
            .snapshotChanges().pipe(map(action => {
              const data = action.payload.data() as User;
              return data;
            }))
            .subscribe(user => {
              this._user.next(user);
              observer.next(user);
            });

        } else {
          this._user.next(null);
          observer.next(null);
        }
      });
    });
    return userObservable;

  }

  login(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password)
      .then(result => {
        if (result.user) {
          result.user.getIdTokenResult()
            .then(res => {
              const docRef = this.firestore.collection(this.userCollectionName).doc(result.user.uid);
              docRef.get().subscribe(doc => {
                const loggedUser = doc.data() as User;
                console.log(res);
                const user = new User(
                  result.user.uid,
                  result.user.email,
                  res.token,
                  new Date(res.expirationTime),
                  loggedUser.name,
                  loggedUser.role
                );
                this.setUserData1(user);
              });
            })
            .catch(error => {
              // console.log(error);
            });
        }
    });
  }
  setUserData1(user: User) {

    this._user.next(user);
    // this.autoLogout(3000); // user.tokenDuration);
    this.firestore.collection(this.userCollectionName).doc(user.id)
      .set({
        id: user.id,
        email: user.email,
        _token: user._token,
        tokenExpirationDate: user.tokenExpirationDate.toISOString(),
        name: user.name,
        role: user.role
      });
    this.storeAuthData(
      user.id,
      user._token,
      user.tokenExpirationDate.toISOString(),
      user.email,
      user.name,
      user.role
    );
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
    this.fireAuth.signOut();
  }

  signup(email: string, password: string, name: string) {
    return this.fireAuth.createUserWithEmailAndPassword(
      email,
      password
    )
    .then(result => {
      if (result.user) {
        result.user.updateProfile({
          displayName: name,
          photoURL: 'GUEST',
        });
        result.user.getIdTokenResult()
          .then(res => {
            console.log(res);
            const user = new User(
              result.user.uid,
              result.user.email,
              res.token,
              new Date(res.expirationTime),
              name,
              'GUEST'
            );
            this.setUserData1(user);


          });
      }
    });
    /* .catch(error => {
      this._user.next(null);
      this.showAlert(error.message);
      this.logout();
    }) */
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  } 

  /* setUser Data(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + (+userData.expiresIn * 1000)
    );
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime,
      '',
      ''
    );
    this.user  = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime,
      '',
      ''
    );
    this._user.next(user);
    // this.autoLogout(3000); // user.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email,
      '',
      ''
    );
  } */

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string,
    name: string,
    role: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email,
      name: name,
      role: role
    });
    Plugins.Storage.set({ key: 'authData', value: data });
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
