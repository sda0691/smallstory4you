import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { NewsService } from '../news.service';
import { DomSanitizer } from '@angular/platform-browser';
import { News } from '../News.model';
import { User } from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';


@Component({
  selector: 'app-detail-news',
  templateUrl: './detail-news.component.html',
  styleUrls: ['./detail-news.component.scss'],
})
export class DetailNewsComponent implements OnInit, OnDestroy{
  @Input() selectedNews: News;
  @Input() loggedUser: User;
  private subs: Subscription[] = [];
  fileRef: AngularFireStorageReference;
  
  constructor(
    private modalCtrl: ModalController,
    private storage: AngularFireStorage,
    private alertCtrl: AlertController,
    private newsService: NewsService,
    private router: Router,
    private domSanitizer: DomSanitizer,

  ) { }

  ngOnInit() {
/*     const storageFolderName = GlobalConstants.newsCollection + '/'; // 'Members/';
    let fullPath = '';
  

    if (this.selectedNews.fileName.length > 0) {
      for (const file of this.selectedNews.fileName) {
        fullPath = storageFolderName + file;
        this.fileRef = this.storage.ref(fullPath);

        this.fileRef.getDownloadURL()
        .subscribe(url => {
          this.selectedNews.downloadUrl.push(url);
        });
      }
    } */

  }

  onDeleteNews() {
    this.alertCtrl.create({
      header: 'Warning',
      message: 'Are you sure to delete?',
      buttons: [{text: 'Okey',
        handler: () => {
          this.newsService.delete_news(this.selectedNews);
          this.modalCtrl.dismiss();
          
          this.router.navigate(['/main/tabs/news']);
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
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
