import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { CreateAuthComponent } from './auth/create-auth/create-auth.component';
import { TopImageComponent } from './shared/top-image/top-image.component';
import { NewsPageModule } from './main/news/news.module';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { EditMediaComponent } from './main/medias/edit-media/edit-media.component';


@NgModule({
  declarations: [AppComponent, AuthComponent, CreateAuthComponent, ResetPasswordComponent, EditMediaComponent],
  entryComponents: [AuthComponent, CreateAuthComponent, ResetPasswordComponent, EditMediaComponent],

  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    NewsPageModule
  ],

  providers: [
    StatusBar,
    SplashScreen,
    CallNumber
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
