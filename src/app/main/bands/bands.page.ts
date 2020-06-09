import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-bands',
  templateUrl: './bands.page.html',
  styleUrls: ['./bands.page.scss'],
})
export class BandsPage implements OnInit {
  isAuth = false;
  loggedUser: User;

  constructor(
    private authService: AuthService
  ) {  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.authService.loggedUser.subscribe(user => {
      console.log('user user user');
      if (user) {
        this.loggedUser = user;
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
    });
  }
}
