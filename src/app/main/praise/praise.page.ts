import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/auth/user.model';
import { PraiseService } from './praise.service';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CreatePraiseComponent } from './create-praise/create-praise.component';
import { Praise } from './praise.model';
import { EditPraiseComponent } from './edit-praise/edit-praise.component';

@Component({
  selector: 'app-praise',
  templateUrl: './praise.page.html',
  styleUrls: ['./praise.page.scss'],
})
export class PraisePage implements OnInit {
  @ViewChild('audio', {static: false}) audioPlayer: ElementRef; 
  private Subs: Subscription[] = [];
  loggedUser: User;
  loadedData = []; // Praise[];
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

  selectedPlayList = [];

  constructor(
    private domSanitizer: DomSanitizer,
    private praiseService: PraiseService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController



  ) { }

  ngOnInit() {
    this.Subs.push(this.praiseService.praises
      .subscribe(data => {
        if (data) {
          this.loadedData = data;
          // this.selectedMedia = this.loadedData[0];
          /* if (this.selectedMedia) {
             this.youtubeSanitizer(this.selectedMedia.youtubeLink);
             this.getDownloadUrl();
          } */
          // console.log(this.selectedMedia.youtubeLink);
        }
      })
    );
    this.Subs.push(this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    }));
  }
  ionViewWillEnter() {
    this.Subs.push(this.authService.getCurrentUser().subscribe(user => {
      this.loadingCtrl.create({message: 'Loading members...'})
      .then(loadingEl => {
        loadingEl.present();
        this.Subs.push(this.praiseService.fetchMembers()
          .subscribe(data => {
            loadingEl.dismiss();
          }, error => {
            loadingEl.dismiss();
            console.log(error);
          }));
      });
    }));
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
      // this.membersService.delete_student(this.selectedMember.id);
  
  }
  playSelected() {
/*     const player = <HTMLAudioElement>document.getElementById("audio");
    player.play();
    Observable.fromEvent(player, 'ended').subscribe(console.log); */
    if (this.selectedPlayList.length <= 0) {
      this.showAlert('음악을 선택해주세요');
      return;
    }
    this.showFooter = true;
    this.playListCount = 0;
  
    // this.playListCount ++ ;
    console.log('play' + this.selectedPlayList[this.playListCount].title);
    this.audioTitle = this.selectedPlayList[this.playListCount].title;
    this.audioUrl = this.selectedPlayList[this.playListCount].downloadUrl;
    this.audioPlayer.nativeElement.load();
    this.audioPlayer.nativeElement.play();
    this.playListCount ++ ;

    
    /* this.audio = new Audio();
    this.audio.src = 'http://www.archive.org/download/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3';
    this.audio.load();
    this.audio.play(); */
  }
  playSingle(selectedSong) {
    console.log('item click');
    this.selectedColor = 'var(--ion-color-primary)';
    this.audioTitle = selectedSong.title;
    this.audioUrl = selectedSong.downloadUrl;
    this.audioPlayer.nativeElement.load();
    this.audioPlayer.nativeElement.play();
    this.showActiveEqualizer = 'played';
    this.showFooter = true;
  }
  audioEnded(): void {
    if (this.selectedPlayList.length === this.playListCount) {
      console.log('ended!!');
      this.showAudio = 'none';
      this.showActiveEqualizer = '';
      return;
    }

    console.log('play' + this.selectedPlayList[this.playListCount].title);
    this.audioTitle = this.selectedPlayList[this.playListCount].title;
    this.audioUrl = this.selectedPlayList[this.playListCount].downloadUrl;
    this.audioPlayer.nativeElement.load();
    this.audioPlayer.nativeElement.play();
    this.playListCount ++ ;
  }
  audioPaused(): void {
    console.log('audio paused');
    this.showActiveEqualizer = 'paused';
  }
  audioPlayed(): void {
    console.log('audio Played');
    this.showActiveEqualizer = 'played';
  }
  onPlayList() {
    this.showPlaylist = !this.showPlaylist;
  }
  selectList(item, event) {
    console.log(event);
    console.log(event.target.checked);
    const checked = event.target.checked;
    if (checked) {
      this.selectedPlayList.push(item);
      console.log(this.selectedPlayList);
    } else {
      if (this.selectedPlayList.length > 0) {
        this.selectedPlayList = 
          this.selectedPlayList.filter(test => item.id !== test.id);
        console.log(this.selectedPlayList);
      }

    }
  }
  removeList(item) {
    if (this.selectedPlayList.length > 0) {
      if (this.audioTitle === item.title) {
        
        this.audioPlayer.nativeElement.pause();
        this.audioUrl = '';
        
        // if this song is ths last 
        if (this.selectedPlayList.length === this.playListCount) {
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

        if (arrayIndexRemove < arrayIndexPlaying  ) {
          this.selectedPlayList = this.selectedPlayList.filter(test => item.id !== test.id);
          this.playListCount --;
        } else {
          this.selectedPlayList = this.selectedPlayList.filter(test => item.id !== test.id);
        }

      }
/*       this.selectedPlayList = this.selectedPlayList.filter(test => item.id !== test.id);
      this.audioPlayer.nativeElement.pause();
      this.audioUrl = ''; */

    }
    console.log(this.selectedPlayList);
  }
  private showAlert(message: string) {
    this.alertCtrl.create({
      // header: 'Error',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
  /* selectYoutubePlay() {
    const vid = 'u3srfti_1u0';
    const audio_streams = {};
    const audio_tag = <HTMLAudioElement>document.getElementById('audioPlayer');

 

 
    // tslint:disable-next-line: quotemark
    fetch("https://"+vid+"-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D" + vid).then(response => {
        if (response.ok) {
            response.text().then(data1 => {

                const data = this.parse_str(data1),
                    streams = (data.url_encoded_fmt_stream_map + ',' + data.adaptive_fmts).split(',');

                streams.forEach(function(s, n) {
                    var stream = this.parse_str(s),
                        itag = stream.itag * 1,
                        quality = '',
                        quality1 =false;
                    console.log(stream);
                    switch (itag) {
                        case 139:
                            quality = "48kbps";
                            quality1 = true;
                            break;
                        case 140:
                            quality = "128kbps";
                            quality1 = true;
                            break;
                        case 141:
                            quality = "256kbps";
                            quality1 = true;
                            break;
                    }
                    if (quality1) {
                      audio_streams[quality] = stream.url;
                    };
                });

                console.log(audio_streams);

                audio_tag.src = audio_streams['128kbps'];
                audio_tag.play();
            });
        }
    });


      // this.youtubeSanitizer('u3srfti_1u0');
  } */
  parse_str(str) {
    return str.split('&').reduce(function(params, param) {
        var paramSplit = param.split('=').map(function(value) {
            return decodeURIComponent(value.replace('+', ' '));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
    }, {});
  }

  /* youtubeSanitizer(youtubeLink){
    const path =  'https://www.youtube.com/embed/' + youtubeLink ;
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(path);
  } */
}
