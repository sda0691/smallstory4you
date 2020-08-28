import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import {   Capacitor,
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  PluginListenerHandle } from '@capacitor/core';


const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
const { PushNotifications } = Plugins;


import { FCM } from '@capacitor-community/fcm';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
const fcm = new FCM();

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  test: PluginListenerHandle;
  test1: PluginListenerHandle;
  test2: PluginListenerHandle;
  test3: PluginListenerHandle;

  topicName = 'super-awesome-topic';
  remoteToken: string;

  constructor(
    private firestore: AngularFirestore,
    private platform: Platform,
    private router: Router,
    private commonService: CommonService,
  ) { }


  saveToken(token) {
    /* if (!token) {
      return;
    } */
    const devicesDatabaseReference = this.firestore.collection('MessageToken');
    const data = {
      token,
     };
    return devicesDatabaseReference.add({
      token: token
    });
  }
  register() {
    if (isPushNotificationsAvailable) {
      Plugins.Storage.get({ key: 'pushMyNotification' }).then( data => {
        if((data.value === '1' || !data )) {
            console.log(data.value);
            this.addListener();
              // Request permission to use push notifications
                  // iOS will prompt user and return if they granted permission or not
                  // Android will just grant without prompting

                  // End of Push Notification

        }
      });
    }
  }
  removeListener() {
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

      } else {
        // Show some error
      }
    });
    // On success, we should be able to receive notifications
    this.test = PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        // alert('Push registration success, token: ' + token.value);
        // this.notificationService.saveToken(token.value);
      }
    );
    // Some issue with our setup and push will not work
    this.test1 = PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );
    // Show us the notification payload if the app is open on our device
    this.test2 = PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        this.commonService.showAlert(notification.body.substring(0, 300));
        // alert('Push received: ' + JSON.stringify(notification));
        // alert(notification.body.substring(0, 300));
      }
    );
    // Method called when tapping on a notification
    this.test3 = PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        // alert(notification.notification.data.landing_page);
        // alert('Push action performed: ' + JSON.stringify(notification));
        this.router.navigateByUrl(notification.notification.data.landing_page);
      }
    );
    if (this.test) {
      this.test.remove();
    }
    if (this.test1) {
      this.test1.remove();
    }
    if (this.test2) {
      this.test2.remove();
    }
    if (this.test3) {
      this.test3.remove();
    }
  
  }
  addListener() {
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

      } else {
        // Show some error
      }
    });
    // On success, we should be able to receive notifications
    this.test = PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        // alert('Push registration success, token: ' + token.value);
        // this.notificationService.saveToken(token.value);
      }
    );
    // Some issue with our setup and push will not work
    this.test1 = PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );
    // Show us the notification payload if the app is open on our device
    this.test2 = PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        this.commonService.showAlert(notification.body.substring(0, 300));
        // alert('Push received: ' + JSON.stringify(notification));
        // alert(notification.body.substring(0, 300));
      }
    );
    // Method called when tapping on a notification
    this.test3 = PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        // alert(notification.notification.data.landing_page);
        // alert('Push action performed: ' + JSON.stringify(notification));
        this.router.navigateByUrl(notification.notification.data.landing_page);
      }
    );
  }
  
  subscribeTo() {
    if (isPushNotificationsAvailable) { 
      PushNotifications.register()
      .then((_) => {
        fcm
          .subscribeTo({ topic: this.topicName })
          .then((r) => alert(`subscribed to topic ${this.topicName}`))
          .catch((err) => console.log(err));
      })
      .catch((err) => alert(JSON.stringify(err)));
    }

  }

  unsubscribeFrom() {
    if (isPushNotificationsAvailable) {
      fcm
      .unsubscribeFrom({ topic: 'test' })
      .then((r) => alert(`unsubscribed from topic ${this.topicName}`))
      .catch((err) => console.log(err));
    if (this.platform.is('android')) {
      fcm.deleteInstance();
    }
    }

  }

  getToken() {
    fcm
      .getToken()
      .then((result) => {
        return result.token;
        this.remoteToken = result.token;
      })
      .catch((err) => console.log(err));
  }

}
