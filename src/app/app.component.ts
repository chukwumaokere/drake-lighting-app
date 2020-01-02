import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Environment } from '@ionic-native/google-maps/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
        Environment.setEnv({
            // Api key for your server
            // (Make sure the api key should have Website restrictions for your website domain only)
            'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDmZNVDUxBxJvBByQcLZ4fOkOfgbCGaogA',

            // Api key for local development
            // (Make sure the api key should have Website restrictions for 'http://localhost' only)
            'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyDmZNVDUxBxJvBByQcLZ4fOkOfgbCGaogA'
        });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
