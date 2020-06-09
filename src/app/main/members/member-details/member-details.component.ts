import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Member } from '../member.model';
import { Router } from '@angular/router';
import { MembersService } from '../members.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {

  @Input() selectedMember: Member;
  
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private membersService: MembersService,
    private alertCtrl: AlertController,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {}

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
    window.open("tel:" + this.selectedMember.phone1,"_system");

        /* this.callNumber.callNumber("18001010101", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err)); */
  }

  onText() {
    window.open("sms:"+ this.selectedMember.phone1,"_system");
  }

}
