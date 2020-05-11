import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // tslint:disable-next-line: variable-name
  // private _userIsAuthenticated = false;
  private _userIsAuthenticated = new BehaviorSubject<boolean>(false);
  private _userId = 'abc';

  get userId() {
    return this._userId;
  }
  get userIsAuthenticated() {
    // return this._userIsAuthenticated;
    return this._userIsAuthenticated.asObservable();
  }
  constructor() { }

  login() {
    // this._userIsAuthenticated = true;
    this._userIsAuthenticated.next(true);
  }

  logout() {
    // this._userIsAuthenticated = false;
    this._userIsAuthenticated.next(false);
  }
}
