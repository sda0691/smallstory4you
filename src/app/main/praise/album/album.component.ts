import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { User } from 'src/app/auth/user.model';
import { PraiseService } from '../praise.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { EditAlbumComponent } from '../edit-album/edit-album.component';
import { Album } from '../praise.model';


@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit, OnDestroy {
  @Input() loggedUser: User;

  @ViewChild('audio', {static: false}) audioPlayer: ElementRef; 
  
  private subs: Subscription[] = [];
  loadedData = [];
  loadedAlbumData = [];
  selectedData = [];
  selectedAlbum: Album;
  audioUrl = '';
  audioTitle = '';
  albumName = '';
  showFooter = false;
  showPlaylist = false;
  showActiveEqualizer = '';
  showAudio = 'none';
  selectedColor = 'black';
  repeatPlay = true;
  constructor(
    private modalCtrl: ModalController,
    private praiseService: PraiseService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    console.log(this.loggedUser.id);
    this.loadingCtrl.create({message: 'Loading Praises...'})
    .then(loadingEl => {
      loadingEl.present();
      this.subs.push(this.praiseService.fetchAlbum(this.loggedUser.id)
        .subscribe(data => {
          const taskArr = [];
          this.loadedData = data;
      
          console.log(this.loadedData);

          data.forEach(item => {
            console.log(item.id);
            console.log(item.songList);
            
            if (item.songList) {

              item.songList.forEach(element => {
                console.log(element);
                this.subs.push(this.praiseService.getPraiseById(element)
                .subscribe(praise => {
                  this.loadedAlbumData.push({
                    albumId: item.id,
                    albumName: item.albumName,
                    praiseId: praise.id,
                    title: praise.title,
                    downloadUrl: praise.downloadUrl,
                    genre: praise.genre,
                    format: praise.format,
                    singer: praise.singer
                  });
                }));
              });
            }
          });
          // this.loadedPraiseData = taskArr;
          // console.log(this.loadedPraiseData);
          loadingEl.dismiss();
        }, error => {
          loadingEl.dismiss();
          console.log(error);
        }));
    });
  }
  onUpdateAlbum() {
    console.log(this.selectedAlbum);
    this.modalCtrl.create({

      component: EditAlbumComponent,
      componentProps: {selectedAlbum: this.selectedAlbum}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      const albumName = resultData.role;
      this.praiseService.updateAlbumName(this.selectedAlbum.id ,albumName)
        .then(doc => {

        }).catch(error => {
          this.showAlert(error.message);
        });
    });
  }
  onRemoveAlbum() {
    console.log(this.selectedAlbum.id);
    this.alertCtrl.create({
      header: 'Warning',
      message: 'Are you sure to delete?',
      buttons: [{text: 'Okey',
        handler: () => {
          this.praiseService.removeAlbum(this.selectedAlbum.id)
            .then(() => {

            }).catch(error => {
              this.showAlert(error.message);
            });
          this.modalCtrl.dismiss();
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
  }
  playAlbum(item) {
    
    this.selectedAlbum = item;
    console.log(this.selectedAlbum);

    this.albumName = item.albumName;
    console.log(this.albumName);
    console.log(this.loadedData);
    this.selectedData = [];
    this.selectedData = this.loadedAlbumData.filter(x => x.albumId === item.id);
    console.log(this.selectedData);
    if (this.selectedData.length > 0) {
      this.playSongs(this.selectedData[0]);
    }
  }

  /////////////////////  Play Audio   /////////////////////////////
  playSongs(playItem) {
    if (!this.showFooter) {
      this.showFooter = true;
    }
    this.audioTitle = playItem.title;
    this.audioUrl = playItem.downloadUrl;
    this.audioPlayer.nativeElement.load();
    this.audioPlayer.nativeElement.play();
  }
  playSingle(selectedSong) {
    this.playSongs(selectedSong);
    const isExist = this.selectedData.find(x => x.id === selectedSong.id);
    if (isExist) {
      // do not show any message and then do not push to object
      // this.showAlert('이미 선택하신 곡입니다');
    } else {
      this.selectedData.push(selectedSong);
      // this.showAlert('선택하신 곡이 리스트에 추가 되었습니다');
    }
  }

  getNext(db, key) {
    for (let i = 0; i < db.length; i++) {
      if (db[i].title === key) {
        return db[i + 1] ;
      }
    }
  }

  audioEnded(): void {
    const nextItem = this.getNext(this.selectedData, this.audioTitle);
    console.log(nextItem);
    if (!nextItem || nextItem === 'undefined') {
      if (this.repeatPlay) {
        this.playSongs(this.selectedData[0]);
      } else {
        this.showAudio = 'none';
        this.showActiveEqualizer = '';
        this.audioTitle = '';
        this.audioUrl = ''; 
      }
      return;
    } else {
      this.playSongs(nextItem);
    }
  }
  audioPaused(): void {
    this.showActiveEqualizer = 'paused';
  }
  audioPlayed(): void {
    this.showActiveEqualizer = 'played';
  }
  removeList(item, index) {
    this.alertCtrl.create({
      header: 'Warning',
      message: 'Are you sure to delete?',
      buttons: [{text: 'Okey',
        handler: () => {
          this.praiseService.removeFromAlbum(item.albumId, item.praiseId)
            .then(() => {
              if (this.selectedData.length > 0) {
                if (this.audioTitle === item.title) {
                  this.audioPlayer.nativeElement.pause();
                  this.audioEnded();
                  this.selectedData.splice(index, 1);
                } else {
                  this.selectedData.splice(index, 1);
                }
              } 
            }).catch(error => {
              this.showAlert(error.message);
            });


        }
      },
      {
        text: 'No',
          handler: () => {
          }
      }
    ]
    }). then (alertEl => {
      alertEl.present();
    });
  }
  onRepeatToggle(event) {
    this.repeatPlay = !this.repeatPlay;
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      // header: 'Error',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
