import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/auth/user.model';
import { PraiseService } from './praise.service';
import { ModalController, LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CreatePraiseComponent } from './create-praise/create-praise.component';
import { Praise } from './praise.model';
import { EditPraiseComponent } from './edit-praise/edit-praise.component';
import { AlbumComponent } from './album/album.component';
import { NewAlbumComponent } from './new-album/new-album.component';
import { CommonService } from 'src/app/common/common.service';

@Component({
  selector: 'app-praise',
  templateUrl: './praise.page.html',
  styleUrls: ['./praise.page.scss'],
 
})
export class PraisePage implements OnInit, OnDestroy {
  @ViewChild('audio', {static: false}) audioPlayer: ElementRef; 
  @ViewChild('source', {static: false}) audioSource: ElementRef; 
  private Subs: Subscription[] = [];
  loggedUser: User;

  showAudio = 'none';
  selectedColor = 'black';
  showActiveEqualizer = '';
  showFooter = false;
  showPlaylist = false;
  segCategory = 'all';
  
  audio: any;
  audioUrl = '';
  trustedVideoUrl: SafeResourceUrl;
  playListCount = 0;
  audioTitle = '';

  loadedData = []; 
  searchedData = [];
  filteredData = [];
  renderedPraise = [];
  selectedPlayList = [];

  loadedAlbumData = [];
  selectedAlbumList = [];
  search = '';
  counter = 0;
  repeatToggle = false;
  repeatPlay = false;

  constructor(
    private domSanitizer: DomSanitizer,
    private praiseService: PraiseService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.Subs.push(this.praiseService.praises
      .subscribe(data => {
        if (data) {
          this.loadedData = data;
          this.filteredData = data;
        }
      })
    );
    this.Subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));
  }

  ionViewWillEnter() {
    this.Subs.push(this.authService.getCurrentUser().subscribe(user => {
      this.loadingCtrl.create({message: 'Loading Praises...'})
      .then(loadingEl => {
        loadingEl.present();
        this.Subs.push(this.praiseService.fetchMembers()
          .subscribe(data => {
            if (this.segCategory.toUpperCase() === 'ALL') {
              this.filteredData = data;
            } else {
              this.filteredData = data.filter(data => data.category === this.segCategory);
            }
            this.searchedData = this.filteredData;
            this.resetCategory();
            this.showMore(this.searchedData);
            loadingEl.dismiss();
          }, error => {
            loadingEl.dismiss();
            console.log(error);
          }));
      });
    }));
  }
  showMore(data) {
    let count = 0;
    // console.log(this.filteredData);
    // console.log(this.renderedPraise);
    if (data) {
      for (let i = this.counter + 1 ; i <= data.length; i++){
        if (this.segCategory.toUpperCase() === 'ALL' || data[i - 1].category === this.segCategory) {
          this.renderedPraise.push(data[i - 1]);
          count++;
          if (count % 2 === 0) {
            break;
          }
        }

      }
      this.counter += 2;
    }
/* 
    if (this.filteredData) {
      for (let i = this.counter + 1 ; i <= this.filteredData.length; i++){
        if (this.segCategory.toUpperCase() === 'ALL' || this.filteredData[i - 1].category === this.segCategory) {
          this.renderedPraise.push(this.filteredData[i - 1]);
          count++;
          if (count % 2 === 0) {
            break;
          }
        }

      }
      this.counter += 2;
    }
     */
    // console.log(this.renderedPraise);
  }
  private resetCategory() {
    this.renderedPraise = [];
    this.counter = 0;
  }
  selectCategory(event) {
    // new solution without getting to firebase
    // this.indexCount = 0;
    // console.log(event.detail.value);
    // console.log(this.loadedData);
    this.resetCategory();
    this.segCategory = event.detail.value;
    if (event.detail.value.toUpperCase() === 'ALL') {
      this.filteredData = this.loadedData;
    } else {
      this.filteredData = this.loadedData.filter(x => x.category === this.segCategory);
    }
    if (this.search.length > 0) {
      this.searchedData = this.filteredData.filter(x => 
        x.title.includes(this.search) || x.singer.includes(this.search)
      );
    } else {
      this.searchedData = this.filteredData;
    }
    // console.log(this.filteredData);
    this.showMore(this.searchedData);
  }

  openMyAlbum() {
    this.puaseAudio();
    this.modalCtrl.create({
      component: AlbumComponent,
      componentProps: {loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }
  onAddPraise() {
    this.modalCtrl.create({
      component: CreatePraiseComponent,
      componentProps: {loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }
  openEditPraise(praise: Praise, slidingItem) {
    slidingItem.close();
    this.modalCtrl.create({
      component: EditPraiseComponent,
      componentProps: {loggedUser: this.loggedUser, selectedPraise: praise}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }
  onDeletePraise(praise: Praise, slidingItem) {
    slidingItem.close();
    this.alertCtrl.create({
      header: 'Warning',
      message: 'Are you sure to delete?',
      buttons: [{text: 'Okey',
        handler: () => {
          this.praiseService.delete_praise(praise);
          // this.modalCtrl.dismiss();
          // this.router.navigate(['/main/tabs/members']);
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
  playSelected() {
    /*     
    const player = <HTMLAudioElement>document.getElementById("audio");
    player.play();
    Observable.fromEvent(player, 'ended').subscribe(console.log); 
    */
    if (this.selectedPlayList.length <= 0) {
      
      this.commonService.showAlert('음악을 선택해주세요');
      return;
    }
    /*    
    if (this.audioTitle.length > 0) {
      this.commonService.showAlert('음악이 재생 중입니다');
      return;
    } 
    */

    // this.showFooter = true;
    // this.playListCount = 0;
    this.playSongs(this.selectedPlayList[0]);

  }
  playSingle(selectedSong) {
    this.playSongs(selectedSong);
    const isExist = this.selectedPlayList.find(x => x.id === selectedSong.id);
    if (isExist) {
      // do not show any message and then do not push to object
      // this.commonService.showAlert('이미 선택하신 곡입니다');
    } else {
      this.selectedPlayList.push(selectedSong);
      // this.commonService.showAlert('선택하신 곡이 리스트에 추가 되었습니다');
    }

    /*     
    console.log('item click');
    this.selectedColor = 'var(--ion-color-primary)';
    this.audioTitle = selectedSong.title;
    this.audioUrl = selectedSong.downloadUrl;
    this.audioPlayer.nativeElement.load();
    this.audioPlayer.nativeElement.play();
    this.showActiveEqualizer = 'played';
    this.showFooter = true;  
    */
  }

  getNext(db, key) {
    for (let i = 0; i < db.length; i++) {
      if (db[i].title === key) {
        return db[i + 1] ;
      }
    }
  }

  audioEnded(): void {
    const nextItem = this.getNext(this.selectedPlayList, this.audioTitle);
    console.log(nextItem);
    if (!nextItem || nextItem === 'undefined') {
      if (this.repeatPlay) {
        this.playSongs(this.selectedPlayList[0]);
      } else {
        this.showAudio = 'none';
        this.showActiveEqualizer = '';
        this.audioTitle = '';
        this.audioUrl = '';
      }
      return;
    }
    this.playSongs(nextItem);


 
   /*  return;
    if (this.selectedPlayList.length <= this.playListCount) {
      console.log('playList:' + this.playListCount);
      console.log('selectedPlayList:' + this.selectedPlayList.length);
      this.showAudio = 'none';
      this.showActiveEqualizer = '';
      this.playListCount = 0;
      // this.showFooter = false;
      // this.showPlaylist = false;
      return; 
    }*/
/* 
    console.log('play' + this.selectedPlayList[this.playListCount].title);
    this.audioTitle = this.selectedPlayList[this.playListCount].title;
    this.audioUrl = this.selectedPlayList[this.playListCount].downloadUrl;
    this.audioPlayer.nativeElement.load();
    this.audioPlayer.nativeElement.play();
    this.playListCount ++ ; */
  }
  audioPaused(): void {
    this.showActiveEqualizer = 'paused';
  }
  audioPlayed(): void {
    /*     
    this.audioSource.nativeElement.addEventListener('error', () => {
      this.commonService.showAlert('이 곡은 삭제 되었거나 변경되었으니 삭제 후 다시 앨범에 추가하세요')
      // this.audioEnded();
    }); 
    */
    console.log('audio played playList:' + this.playListCount);
    console.log('selectedPlayList:' + this.selectedPlayList.length);
    if (this.playListCount === 0) {
      // this.playSelected();
    }
    this.showActiveEqualizer = 'played';
  }
  onPlayList() {
    this.showPlaylist = !this.showPlaylist;
  }
  selectList(item, event) {
    /*     
    console.log(event);
    console.log(event.target.checked);
    */
    const checked = event.target.checked;
    if (checked) {
      const isExist = this.selectedPlayList.find(x => x.id === item.id);
      if (isExist) {
        // do not show any message and then do not push to object
        // this.commonService.showAlert('이미 선택하신 곡입니다');
      } else {
        this.selectedPlayList.push(item);
        // this.commonService.showAlert('선택하신 곡이 리스트에 추가 되었습니다');
      }

    } else {
      if (this.selectedPlayList.length > 0) {
        this.selectedPlayList = this.selectedPlayList.filter(x => item.id !== x.id);
      }
    }
  }
  createActionSheetButtons() {
    let buttons = [];
    if (this.loadedAlbumData.length < 5) {
      let new_button = {
        text: '새앨범',
        // icon: this.loadedAlbumData[index].icon,
        handler: () => {
          // console.log('setting icon ' + this.possibleButtons[index].icon);
          this.songsToNewAlbum();
          // return true;
        }
      };
      buttons.push(new_button);
    }


    for (let album of this.loadedAlbumData) {
      let button = {
        text: album.albumName,
        // icon: this.loadedAlbumData[index].icon,
        handler: () => {
          // console.log('setting icon ' + this.possibleButtons[index].icon);
          this.songsToAlbum(album.id);
          // return true;
        }
      }
      buttons.push(button);
    }
    return buttons;
  }
  addSongsToAlbum() {

    if (this.selectedAlbumList.length <= 0) {
      this.commonService.showAlert('앨범에 추가할 음악을 선택해주세요');
      return;
    }
    this.Subs.push(this.praiseService.fetchAlbum(this.loggedUser.id)
        .subscribe(data => {
          this.loadedAlbumData = data;

          this.actionSheetCtrl.create({
            header: '앨범선택',
            cssClass: 'action-sheet',
            
            buttons: this.createActionSheetButtons()
      
          }).then(actionSheetEl => {
            actionSheetEl.present();
          });
        })
    );

  }
  songsToNewAlbum() {
    this.modalCtrl.create({
      component: NewAlbumComponent,
      // componentProps: {selectedPray: pray, loggedUser: this.loggedUser}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      const albumName = resultData.role;
      this.praiseService.add_album(albumName, this.loggedUser.id)
        .then(doc => {
          console.log(doc.id);
          const albumId = doc.id;
          this.songsToAlbum(albumId);
        }).catch(error => {
          this.commonService.showAlert(error.message);
        });
    });
  }
  songsToAlbum(albumId) {
    let isSongAdded = false;
    let totalSongCountByAlbum = 0;
    let songList = []
    let selectedAlbum = [];
    selectedAlbum = this.loadedAlbumData.filter(x => x.id === albumId);

    for (const id of this.selectedAlbumList) {
      if (selectedAlbum[0].songList.indexOf(id) !== 0) {
        songList.push(id);
        isSongAdded = true;
      }
    }
    if (!isSongAdded) {
      return;
    }

    totalSongCountByAlbum = selectedAlbum[0].songList.length + songList.length;
    if (totalSongCountByAlbum > 2) {
      this.commonService.showAlert('앨범당 20곡 이상을 저장할 수 없습니다.');
      return;
    }


    for (const id of selectedAlbum[0].songList) {
        songList.push(id);
    }

    this.loadingCtrl.create({message: 'Updating Album...'})
      .then(loadingEl => {
        loadingEl.present();
        this.praiseService.updateAlbumSongList(albumId, songList ).then(data => {
          loadingEl.dismiss();
          this.commonService.showAlert('Song(s) have been added to Album');
        }).catch (error => {
          loadingEl.dismiss();
          this.commonService.showAlert(error.message);
        });
    });
  }
  selectListForAlbum(item, event) {
    const checked = event.target.checked;
    if (checked) {
      const isExist = this.selectedAlbumList.find(x => x.id === item.id);
      if (isExist) {
       } else {
        this.selectedAlbumList.push(item.id);
      }
    } else {
      if (this.selectedAlbumList.length > 0) {
        this.selectedAlbumList = this.selectedAlbumList.filter(x => item.id !== x.id);
      }
    }
    console.log(this.selectedAlbumList);
  }
  removeFromAlbum() {

  }
  removeList(item, index) {
    if (this.selectedPlayList.length > 0) {
      if (this.audioTitle === item.title) {
        this.audioPlayer.nativeElement.pause();
        this.audioEnded();
        this.selectedPlayList.splice(index, 1);
      } else {
        this.selectedPlayList.splice(index, 1);
      }
      // if remove record is the same as play record
      /* if (this.audioTitle === item.title) {
        

        this.audioPlayer.nativeElement.pause();
        this.audioUrl = '';
        
        // if this song is ths last 
        if (this.selectedPlayList.length <= this.playListCount) {
          console.log('ended!!');
          this.showAudio = 'none';
          this.showActiveEqualizer = '';
          this.showFooter = false;
          
          this.showPlaylist = false;
          this.selectedPlayList = [];
          return;
        } else {
          this.selectedPlayList = this.selectedPlayList.filter(test => item.id !== test.id);
          this.playListCount --;
          // play the next song
          console.log('play' + this.selectedPlayList[this.playListCount].title);
          this.audioTitle = this.selectedPlayList[this.playListCount].title;
          this.audioUrl = this.selectedPlayList[this.playListCount].downloadUrl;
          this.audioPlayer.nativeElement.load();
          this.audioPlayer.nativeElement.play();
          this.playListCount ++ ;
        }

      } else {
        
        const arrayIndexRemove = this.selectedPlayList.indexOf(item.title);
        const arrayIndexPlaying = this.selectedPlayList.indexOf(this.selectedPlayList[this.playListCount].title);
        // if removed record is before play record
        if (arrayIndexRemove < arrayIndexPlaying  ) {
          this.selectedPlayList = this.selectedPlayList.filter(test => item.id !== test.id);
          this.playListCount --;
        } else {
          this.selectedPlayList = this.selectedPlayList.filter(test => item.id !== test.id);
        }

      } */
      /*       
      this.selectedPlayList = this.selectedPlayList.filter(test => item.id !== test.id);
      this.audioPlayer.nativeElement.pause();
      this.audioUrl = ''; 
      */

    }
  }
  onRepeatToggle(event) {
    console.log(event.detail.value);
    this.repeatPlay = !this.repeatPlay;
  }
  onSearch() {
    console.log(this.loadedData);
    this.resetCategory();
    if (this.search.length > 0) {
      this.searchedData = this.filteredData.filter(x => 
        x.title.includes(this.search) || x.singer.includes(this.search)
      );
    } else {
      this.searchedData = this.filteredData;
    }
    this.showMore(this.searchedData);
  }
  /*
  private showAlert(message: string) {
    this.alertCtrl.create({
      // header: 'Error',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
  */
  puaseAudio() {
    this.showAudio = 'none';
    this.showActiveEqualizer = '';
    this.audioTitle = '';
    this.audioUrl = '';
    this.audioPlayer.nativeElement.pause();
  }
  ionViewWillLeave() {
    console.log('leave');
    this.Subs.forEach(sub => sub.unsubscribe());
    this.puaseAudio();
  }
  ngOnDestroy() {
    // this is not being called at all in ionic.
  }
  /*   
  parse_str(str) {
    return str.split('&').reduce(function(params, param) {
        var paramSplit = param.split('=').map(function(value) {
            return decodeURIComponent(value.replace('+', ' '));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
    }, {});
  } 
  */
}
