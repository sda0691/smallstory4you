import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-myinfo',
  templateUrl: './myinfo.component.html',
  styleUrls: ['./myinfo.component.scss'],
})
export class MyinfoComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onLogout() {
    this.modalCtrl.dismiss(null, 'cancel');
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
