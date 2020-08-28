import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from './global-constants';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  audio: any;

constructor(
  private alertCtrl: AlertController,
  private httpClient: HttpClient
) { }

  showAlert( message: string) {
    this.alertCtrl.create({
      // header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }
  PushNotification(title, landding_page) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'key=AAAA9vyfruQ:APA91bFOKqRKLjpJDoscfaEZM1BMntUzPuANWCs-2vYU6VTH_KfCBuKD0hIrACxBf3y5tkPXEKaSFAX_pCEmahVHWhBHvyWxbesOL9BMIP1FkWsovU-4tx0XjwCZsyGUuBNJN1prSle4'
      })
    };

    const postData = {
      // 'to': 'fYCaIYfTRQKtc59SH6Dm1t:APA91bFju-DbyampVxGHbGTfGqpznSdUFAUjGocgJGYbs2QE-OYbU2naHYQW3eC4SUg2i4kR4V6ilTleZiCWXzKNvklgLAhSAk7PEdJn6t4tKpOCx8uSwyRmG2pfaTsc4Yaml9Wa9sxB',
      'to': '/topics/people',
      'notification': {
        'body': title,
        'title': GlobalConstants.churchName // '토론토 서부교회'
      },
      "data":{
        "landing_page": landding_page // "/main/tabs/medias",
      },
    };
    this.httpClient.post('https://fcm.googleapis.com/fcm/send', postData, httpOptions)
       .subscribe(data => {
        console.log(data);
        }, error => {
        console.log(error);
      });
  }
}
