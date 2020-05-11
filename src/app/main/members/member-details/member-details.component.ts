import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Member } from '../member.model';
import { Router } from '@angular/router';
import { MembersService } from '../members.service';

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
    private membersService: MembersService
  ) { }

  ngOnInit() {}

  onEdit() {
    console.log('member edit');
    this.modalCtrl.dismiss();
    this.router.navigate(['/main/tabs/members/edit/' + this.selectedMember.id]);
  }
  onDelete() {
    console.log('member delete');
    // this.membersService.delete_student(this.selectedMember.id);
    this.membersService.deleteMember(this.selectedMember);
    this.modalCtrl.dismiss();
    this.router.navigate(['/main/tabs/members']);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
