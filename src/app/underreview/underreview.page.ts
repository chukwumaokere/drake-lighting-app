import { Component, OnInit, LOCALE_ID, Inject, } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NavController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AppConstants } from '../providers/constant/constant';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-underreview',
  templateUrl: './underreview.page.html',
  styleUrls: ['./underreview.page.scss'],
})
export class UnderreviewPage implements OnInit {
  underreview: object;
  userinfo: any;
  user_id: any;
  count_underreview: any;
  apiurl: any;
  service = {
    id: '',
    tower: '', //Will be the Transferee + type of service
    tos: '',
    desc: '', //Will be address here
    longdate: '',
    startTime: '', //Will be time as 00:00 A/PM
    endTime: '', //Will be time as 00:00 A/PM
    status: '',
  };

  constructor(
    private httpClient: HttpClient,
    public navCtrl: NavController,
    private router: Router,
    public storage: Storage,
    private activatedRoute: ActivatedRoute,
    public appConst: AppConstants,
    public modalCtrl: ModalController,
    @Inject(LOCALE_ID) private locale: string,
    public loadingController: LoadingController
  ) {
    this.apiurl = this.appConst.getApiUrl();
  }

  loading: any;

  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Loading ...'
    });
    this.loading.present();
  }

  async hideLoading() {
    this.loading.dismiss();
  }

  goToDetail(serviceid) {
    this.router.navigateByUrl(`/services/detail/${serviceid}`, { state: {} });
  }

  logout() {
    console.log('logout clicked');
    this.storage.set("userdata", null);
    this.router.navigateByUrl('/login');
  }

  async getCurrentTheme() {
    var current_theme = this.storage.get('userdata').then((userdata) => {
      if (userdata && userdata.length !== 0) {
        //current_theme = userdata.theme.toLowerCase();
        return userdata.theme.toLowerCase();
      } else {
        return false;
      }
    })
    return current_theme;
  }

  async updateCurrentTheme(theme: string) {
    var userjson: object;
    await this.isLogged().then(result => {
      if (!(result == false)) {
        userjson = result;
      }
    })
    //console.log('from set current theme', userjson.theme);
    userjson['theme'] = theme.charAt(0).toUpperCase() + theme.slice(1);
    //console.log('from set current theme', userjson);
    this.storage.set('userdata', userjson);
    this.userinfo.theme = theme.charAt(0).toUpperCase() + theme.slice(1);
    console.log('updated theme on storage memory');
  }

  async switchTheme() {
    var current_theme;
    await this.getCurrentTheme().then((theme) => {
      console.log("the current theme is", theme);
      current_theme = theme;
    });
    var theme_switcher = {
      "dark": "light",
      "light": "dark"
    };
    var destination_theme = theme_switcher[current_theme]
    console.log('switching theme from:', current_theme);
    console.log('switching theme to:', destination_theme);
    document.body.classList.toggle(destination_theme, true);
    document.body.classList.toggle(current_theme, false);
    this.updateCurrentTheme(destination_theme);
    console.log('theme switched');
  }

  async isLogged() {
    var log_status = this.storage.get('userdata').then((userdata) => {
      if (userdata && userdata.length !== 0) {
        return userdata;
      } else {
        return false;
      }
    })
    return log_status;
  }

  loadTheme(theme) {
    console.log('loading theme', theme);
    document.body.classList.toggle(theme, true);
    var theme_switcher = {
      "dark": "light",
      "light": "dark"
    };
    document.body.classList.toggle(theme_switcher[theme], false); //switch off previous theme if there was one and prefer the loaded theme.
    console.log('turning off previous theme', theme_switcher[theme]);
  }

  getWorkOrders(user_id, type) {
    var logged_user = {
      user_id: user_id,
      type: type
    }
    console.log('fetching records for', logged_user);
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    this.showLoading();
    this.httpClient.post(this.apiurl + "getWorkOrders.php", logged_user, { headers: headers, observe: 'response' })
      .subscribe(data => {
        this.hideLoading();
        console.log(data['body']);
        var success = data['body']['success'];
        console.log('login response was', success);

        if (success == true) {
          var workorders = data['body']['data'];
          console.log('workorders', workorders);
          if (type == 'underreview') {
            if (data['body']['count'] > 0) {
              workorders.forEach(workorder => {
                workorder['longdate'] = workorder['date_start'] + ' ' + workorder['time_start'];
              });
            }
            this.underreview = workorders;
            this.count_underreview = data['body']['count'];
            //console.log('weekly services,', this.weeklyServices);
          }
        } else {
          console.log('failed to fetch records');
        }

      }, error => {
        this.hideLoading();
        //console.log(error);
        //console.log(error.message);
        //console.error(error.message);
        console.log('failed to fetch records');
      });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((userData) => {
      if (userData.length !== 0) {
        this.userinfo = userData;
        //console.log('param user data:', userData);
        try {
          this.loadTheme(userData.theme.toLowerCase());
        } catch{
          console.log('couldnt load theme');
        }
        console.log('param user data length:', userData.length);
        if (userData.length == undefined) {
          console.log('nothing in params, so loading from storage');
          this.isLogged().then(result => {
            if (!(result == false)) {
              //console.log('loading storage data (within param route function)', result);
              this.userinfo = result;
              this.loadTheme(result.theme.toLowerCase());
              this.getWorkOrders(this.userinfo.id, 'underreview');
              this.user_id = this.userinfo.id;
            } else {
              console.log('nothing in storage, going back to login');
              this.logout();
            }
          });
        }
      }
    });
  }

}
