import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { take, switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {

  loggedUser: User;
  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    // when page refreshed in web.
    this.subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));
  }

  ionViewWillEnter() {

  }
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
