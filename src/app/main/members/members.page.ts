import { Component, OnInit, OnDestroy } from '@angular/core';
import { Member } from './member.model';
import { MembersService } from './members.service';
import { ModalController, LoadingController, IonItemSliding } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { MemberDetailsComponent } from './member-details/member-details.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit, OnDestroy {
  // loadedMembers: Member[];
  loadedMembers = []; // Member[];
  private memberSub: Subscription;

  constructor(
    private membersService: MembersService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    /* this.memberSub = this.membersService
      .get_members()
      .subscribe(data => {
      this.loadedMembers = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          groupid: e.payload.doc.data()['groupid'],
          name: e.payload.doc.data()['name'],
          phone1: e.payload.doc.data()['phone1'],
          imageUrl: e.payload.doc.data()['imageUrl'],
          address: e.payload.doc.data()['address'],
          fileName: e.payload.doc.data()['fileName']
        }
      });
    }); */
  }
  ionViewWillEnter() {
    this.loadingCtrl.create({message: 'Loading members...'})
      .then(loadingEl => {
        loadingEl.present();
        this.membersService
        .get_members()
        .subscribe(data => {
          this.loadedMembers = data.map(e => {
            return {
              id: e.payload.doc.id,
              isEdit: false,
              groupid: e.payload.doc.data()['groupid'],
              name: e.payload.doc.data()['name'],
              phone1: e.payload.doc.data()['phone1'],
              imageUrl: e.payload.doc.data()['imageUrl'],
              address: e.payload.doc.data()['address'],
              fileName: e.payload.doc.data()['fileName']
            };
          });
        });
        loadingEl.dismiss();
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
  
  ngOnDestroy() {
    if (this.memberSub) {
      this.memberSub.unsubscribe();
    }
  }
}
