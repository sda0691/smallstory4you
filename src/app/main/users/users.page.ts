import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {
  loggedUser: User;
  private subs: Subscription[] = [];
  loadedData = []; // Pray[];
  audioUrl: string;
  isLoading = false;
  setCategory = 'name';

  constructor(
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private authService: AuthService
  ) { }

  ngOnInit() {
    this.subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));

    this.subs.push(this.authService.users
      .subscribe(data => {
        if (data) {
          this.loadedData = data;
          console.log(this.loadedData);
          // this.selectedData = this.loadedData.filter(data => data.category === this.setCategory);
        }
      })
    );
  }

  
  ionViewWillEnter() {
    this.subs.push(this.authService.getCurrentUser().subscribe(user => {
      this.loadingCtrl.create({message: 'Loading 기도력...'})
      .then(loadingEl => {
          loadingEl.present();
          this.subs.push(this.authService.fetchUsers()
            .subscribe(data => {
              loadingEl.dismiss();
            }, error => {
              loadingEl.dismiss();
              this.showAlert(error.message);
            })
          );
      });
    }));
  }

  openUserDetail(user: User) {
    this.modalCtrl.create({
      component: EditUserComponent,
      componentProps: {selectedUser: user, loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      // header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
        if (event.detail.value === 'name') {
          this.loadedData.sort((a, b): number => { 
            if (a.name < b.name) {return -1 ; }
            if (a.name > b.name) {return 1; }
            return 0;
          });
        } else if (event.detail.value === 'role') {
            this.loadedData.sort((a, b): number => { 
            if (a.role < b.role) {return -1 ; }
            if (a.role > b.role) {return 1; }
            return 0;
          })
        } else if (event.detail.value === 'isAdminConfirmed') {
          this.loadedData.sort((a, b): number => { 
          if (a.isAdminConfirmed < b.isAdminConfirmed) {return -1 ; }
          if (a.isAdminConfirmed > b.isAdminConfirmed) {return 1; }
          return 0;
        })
      }
  }
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }


}
