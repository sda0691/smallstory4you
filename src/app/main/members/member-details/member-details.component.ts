import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { Member } from '../member.model';
import { Router } from '@angular/router';
import { MembersService } from '../members.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {
  @Input() loggedUser: User;
  @Input() selectedMember: Member;
  private textMobile = '';
  private textHome = '';
  private textBusiness = '';
  private iconMobile = '';
  private iconHome = '';
  private iconBusiness = '';

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private membersService: MembersService,
    private alertCtrl: AlertController,
    private callNumber: CallNumber,
    private launchNavigator: LaunchNavigator,
    private actionSheetCtrl: ActionSheetController
  ) { 

  }
  ngOnInit() {
  }
  
  onEdit() {
    console.log('member edit');
    this.modalCtrl.dismiss();
    this.router.navigate(['/main/tabs/members/edit/' + this.selectedMember.id]);
  }
  onDelete() {
    console.log('member delete');
    this.alertCtrl.create({
      header: 'Warning',
      message: 'Are you sure to delete?',
      buttons: [{text: 'Okey',
        handler: () => {
          this.membersService.deleteMember(this.selectedMember);
          this.modalCtrl.dismiss();
          this.router.navigate(['/main/tabs/members']);
        }
      },
      {
        text: 'No',
          handler: () => {
            console.log('Cancel clicked');
          }
      }
    ]
    }). then (alertEl => {
      alertEl.present();
    });
    // this.membersService.delete_student(this.selectedMember.id);

  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onCall() {
    let phoneCount = 0;
    if (this.selectedMember.phone1.length > 0) {
      phoneCount ++;  // 1
      this.textMobile = '(C) ';
      this.iconMobile = 'phone-portrait-outline';
    }
    if (this.selectedMember.homePhone.length > 0) {
      phoneCount = phoneCount + 2;  // 3
      this.textHome = '(H) ';
      this.iconHome = 'home-outline';
    }  
    if (this.selectedMember.businessPhone.length > 0) {
      phoneCount = phoneCount + 4; // 7
      this.textBusiness = '(B) ';
      this.iconBusiness = 'business-outline';
    }
    if (phoneCount === 0) {
      return;
    }
    if (phoneCount === 1) {
      window.open('tel:' + this.selectedMember.phone1, '_system');
      return;
    }
    if (phoneCount === 2) {
      window.open('tel:' + this.selectedMember.homePhone, '_system');
      return;
    }
    if (phoneCount === 4) {
      window.open('tel:' + this.selectedMember.businessPhone, '_system');
      return;
    }
  
    // style action-sheet is in globa.scss. it works on in globa.
    this.actionSheetCtrl.create({
      header: '전화번호선택',
      cssClass: 'action-sheet',
      buttons: [
        {
          icon: this.iconMobile,
          text: this.textMobile + this.selectedMember.phone1,
          cssClass: 'action-sheet',
          handler: () => {
              if (this.selectedMember.phone1.length > 0 ) {
              window.open('tel:' + this.selectedMember.phone1, '_system');
              }
          }
        },
        {
          icon: this.iconHome,
          text: this.textHome + this.selectedMember.homePhone,
          cssClass: 'action-sheet',
          handler: () => {
            if (this.selectedMember.homePhone.length > 0 ) {
              window.open('tel:' + this.selectedMember.homePhone, '_system');
            }
          }
        },
        {
          icon: this.iconBusiness,
          text: this.textBusiness + this.selectedMember.businessPhone,
          cssClass: 'action-sheet',
          handler: () => {
            if (this.selectedMember.businessPhone.length > 0 ) {
              window.open('tel:' + this.selectedMember.businessPhone, '_system');
            }
          }
        },
/*           {
          text: 'Cancel',
          role: 'cancel'
        } */
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });

    // window.open("tel:" + this.selectedMember.phone1,"_system");

        /* this.callNumber.callNumber("18001010101", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err)); */
  }

  onText() {
    window.open('sms:' + this.selectedMember.phone1, '_system');
  }

  onOpenMaps() {
    let options: LaunchNavigatorOptions = {
      start: null,  // current location
      // app: LaunchNavigator.APPS.UBER
    }
    this.launchNavigator.navigate(this.selectedMember.address, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }
}
