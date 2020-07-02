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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { CreateAuthComponent } from './auth/create-auth/create-auth.component';
import { TopImageComponent } from './shared/top-image/top-image.component';
import { NewsPageModule } from './main/news/news.module';
// import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { EditMediaComponent } from './main/medias/edit-media/edit-media.component';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';


@NgModule({
  declarations: [
    AppComponent, 
    AuthComponent, 
    CreateAuthComponent, 
    // ChangePasswordComponent,
    ResetPasswordComponent, 
    EditMediaComponent
  ],
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
    NewsPageModule,
    ReactiveFormsModule
  ],

  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    LaunchNavigator
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
