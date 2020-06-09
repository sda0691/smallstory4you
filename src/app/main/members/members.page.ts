import { Component, OnInit, OnDestroy } from '@angular/core';
import { Member } from './member.model';
import { MembersService } from './members.service';
import { ModalController, LoadingController, IonItemSliding } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { MemberDetailsComponent } from './member-details/member-details.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

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

  constructor(
    private membersService: MembersService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private fireAuth: AngularFireAuth
    ) { 
        this.fireAuth.onAuthStateChanged(user => {
        
        console.log(user);
      });
    }

  ngOnInit() {
    this.Subs.push(this.membersService.members
      .subscribe(data => {
        this.loadedMembers = data;
      }));
  }
  ionViewWillEnter() {
    this.authService.loggedUser.subscribe(user => {
      console.log('user user user');
      console.log(user.id);
    });
    this.authService.userIsAuthenticatedObser.subscribe(isAuth => {
      if (!isAuth) {
        return;
      } else {
        this.isUserAuthenticated = isAuth;
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
      componentProps: {selectedMember: member}
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
  
  onLogout() {
    this.authService.logout();
    // this.router.navigateByUrl('/auth');
  }
  
  ngOnDestroy() {
    this.Subs.forEach(sub => sub.unsubscribe());
/*     if (this.memberSub) {
      this.memberSub.unsubscribe();
    } */
  }
}
