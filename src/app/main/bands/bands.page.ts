import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bands',
  templateUrl: './bands.page.html',
  styleUrls: ['./bands.page.scss'],
})
export class BandsPage implements OnInit {
  isAuth = false;
  loggedUser: User;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {  }

  ngOnInit() {
    this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
/*       if (!user || (user && user.role.toUpperCase() === 'GUEST')) {
        this.router.navigate(['/', 'main', 'tabs', 'medias']);
      } */
    });
  }

  ionViewWillEnter() {
    this.authService.getCurrentUser1().subscribe(user => {
      console.log(user);
    });
  }
}
