import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  isAuth = false;
  private previousAuthState = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
/*     this.authService.userIsAuthenticatedObser.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
    }); */
    this.authService.userIsAuthenticatedObser.subscribe(isAuth => {
      this.isAuth = isAuth;
    }); 
  }
}
