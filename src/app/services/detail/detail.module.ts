import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule , IonicRouteStrategy} from '@ionic/angular';

import { DetailPage } from './detail.page';

import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { ImageModalPage } from '../image-modal/image-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailPage, ImageModalPage],
    entryComponents: [ImageModalPage],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        File,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
})
export class DetailPageModule {}
