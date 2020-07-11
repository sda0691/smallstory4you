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
import { SegmentChangeEventDetail } from '@ionic/core';
import { MyinfoComponent } from 'src/app/auth/myinfo/myinfo.component';
import { AuthComponent } from 'src/app/auth/auth.component';
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
  selectedMember: Member;
  setCategory = 'name';
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
/*         if (this.loadedMembers) {
          this.selectedMember = this.loadedMembers[0];
        } */
      }));

    this.Subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));
  }
  ionViewWillEnter() {
    this.authService.getCurrentUser().subscribe(user => {
      if (!user || (user && user.role.toUpperCase() === 'GUEST')) {
        this.openLogin();
        // this.router.navigate(['/', 'main', 'tabs', 'medias']);
      } else {
        this.isUserAuthenticated = true;
        this.loadingCtrl.create({message: 'Loading members...'})
        .then(loadingEl => {
          loadingEl.present();
          this.Subs.push(this.membersService.fetchMembers()
            .subscribe(data => {
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
    // this.selectedMember = member;

    this.modalCtrl.create({
      component: MemberDetailsComponent,
      componentProps: {selectedMember: member, loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
    }); 
  }
  openLogin() {
    // this.selectedMember = member;

    this.modalCtrl.create({
      component: AuthComponent
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      if (resultData.role === 'cancel') {
        this.router.navigate(['/', 'main', 'tabs', 'medias']);
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

  sortByName() {
    
  }
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    /*     if (event.detail.value === '장년') {
          this.selectedData = this.loadedData.filter(data => data.category === '장년');
          this.setCategory = '장년';
        } else {
          this.selectedData = this.loadedData.filter(data => data.category === '어린이');
          this.setCategory = '어린이';
        } */
        if (event.detail.value === 'name') {
          this.loadedMembers.sort((a, b): number => { 
            if (a.name < b.name) {return -1 ; }
            if (a.name > b.name) {return 1; }
            return 0;
          });
        } else if (event.detail.value === 'group') {
            this.loadedMembers.sort((a, b): number => { 
            if (a.ageStatus < b.ageStatus) {return -1 ; }
            if (a.ageStatus > b.ageStatus) {return 1; }
            return 0;
          })
        }
  
/*         this.selectedData = this.loadedData.filter(data => data.category === event.detail.value);
        if (this.selectedData) {
          this.selectedPray = this.selectedData[this.arrayIndex];
          this.getTodayPray();
        } */
    
      }

  ngOnDestroy() {
    this.Subs.forEach(sub => sub.unsubscribe());
/*     if (this.memberSub) {
      this.memberSub.unsubscribe();
    } */
  }
}
