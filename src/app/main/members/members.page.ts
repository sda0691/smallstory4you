import { Component, OnInit, OnDestroy } from '@angular/core';
import { Member } from './member.model';
import { MembersService } from './members.service';
import { ModalController, LoadingController, IonItemSliding } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { MemberDetailsComponent } from './member-details/member-details.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit, OnDestroy {
  // loadedMembers: Member[];
  loadedMembers = []; // Member[];
  private memberSub: Subscription;
  private Subs: Subscription[] = [];
  isUserAuthenticated = false;
  loggedUser: User;

  constructor(
    private membersService: MembersService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private fireAuth: AngularFireAuth
    ) {
    }

  ngOnInit() {
    this.Subs.push(this.membersService.members
      .subscribe(data => {
        this.loadedMembers = data;
      }));

    this.Subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));
  }
  ionViewWillEnter() {
    this.authService.getCurrentUser1().subscribe(user => {
      if (!user || (user && user.role.toUpperCase() === 'GUEST')) {
        this.router.navigate(['/', 'main', 'tabs', 'medias']);
      } else {
        this.isUserAuthenticated = true;
        this.loadingCtrl.create({message: 'Loading members...'})
        .then(loadingEl => {
          loadingEl.present();
          this.Subs.push(this.membersService.fetchMembers()
            .subscribe(data => {
              // this.loadedMembers = data;
              console.log(data);
              loadingEl.dismiss();
            }, error => {
              loadingEl.dismiss();
              console.log(error);
            }));
        });
      }
    });
  }

  onMemberDetail(member: Member) {
    // this.router.navigateByUrl('/places/tabs/discover');  // angular backward
    // this.navCtrl.navigateBack('/places/tabs/discover'); // ionic backward
    this.modalCtrl.create({
      component: MemberDetailsComponent,
      componentProps: {selectedMember: member, loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      // console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('BOOKED!');
      }
    });
  }

  onEdit(memberId: number, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'main', 'tabs', 'members', 'edit', memberId]);
  }
  
/*   onLogout() {
    this.authService.logout();
  } */
  
  ngOnDestroy() {
    this.Subs.forEach(sub => sub.unsubscribe());
/*     if (this.memberSub) {
      this.memberSub.unsubscribe();
    } */
  }
}
