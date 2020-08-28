import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { Subscription, of } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import {
  Capacitor,
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  PluginListenerHandle} from '@capacitor/core';
import { NotificationService } from './main/notification/notification.service';
import { CommonService } from './common/common.service';

const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
const { PushNotifications } = Plugins;

import { FCM } from '@capacitor-community/fcm';
const fcm = new FCM();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;
  isUserAuthenticated = false;
  pushMyNotificationToggle = false;
  test: PluginListenerHandle;
  test1: PluginListenerHandle;
  test2: PluginListenerHandle;
  test3: PluginListenerHandle;
  notifications: PushNotification[] = [];
  topicName = 'super-awesome-topic';
  remoteToken: string;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private notificationService: NotificationService,
    private router: Router,
    private modelCtrl: ModalController,
    private commonService: CommonService,
    private zone: NgZone
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // this.fcm.subscribeToTopic('people');
    });
  }

  ngOnInit() {
    if (isPushNotificationsAvailable) {

      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermission().then( result => {
        if (result.granted) {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();

        } else {
          // Show some error
        }
      });
      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
        (token: PushNotificationToken) => {
          // alert('Push registration success, token: ' + token.value);
          // this.notificationService.saveToken(token.value);
        }
      );
      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        (error: any) => {
          alert('Error on registration: ' + JSON.stringify(error));
        }
      );
      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
          this.commonService.showAlert(notification.body.substring(0, 300));
          // alert('Push received: ' + JSON.stringify(notification));
          // alert(notification.body.substring(0, 300));
        }
      );
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
          // alert(notification.notification.data.landing_page);
          // alert('Push action performed: ' + JSON.stringify(notification));
          this.router.navigateByUrl(notification.notification.data.landing_page);
        }
      );
      // End of Push Notification     
    }
 

/*     PushNotifications.register()
    .then(() => {
      //
      // Subscribe to a specific topic
      // you can use `FCMPlugin` or just `fcm`
      fcm
        .subscribeTo({ topic: 'test' })
        .then((r) => alert(`subscribed to topic`))
        .catch((err) => console.log(err));
    })
    .catch((err) => alert(JSON.stringify(err)));
 */
//this.notificationService.register();
  /* 
  Plugins.Storage.get({ key: 'pushMyNotification' }).then( data => {
    if((data.value === '1' )) {
        console.log(data.value);
        if (data.value === '1') {
          // Request permission to use push notifications
              // iOS will prompt user and return if they granted permission or not
              // Android will just grant without prompting
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
              // End of Push Notification
        }
    } else {
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
      console.log(data.value);
    }
  }); */
  }


  ionViewWillEnter() {

  }

  onLogout() {

  }

  onLogin() {
    
  }

  ngOnDestroy() {

  }
}
