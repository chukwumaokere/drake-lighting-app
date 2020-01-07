import {Component, OnInit, LOCALE_ID, Inject,} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NavController, ModalController} from '@ionic/angular';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    underreview: any;
    apiurl: any;
    user_id: any;
    userinfo: any;

    constructor(
        private httpClient: HttpClient,
        public navCtrl: NavController,
        private router: Router,
        public storage: Storage,
        private activatedRoute: ActivatedRoute,
        public appConst: AppConstants,
        public modalCtrl: ModalController,
        public loadingController: LoadingController
    ) {
        this.apiurl = this.appConst.getApiUrl();
    }

    loading: any;

    async showLoading() {
        this.loading = await this.loadingController.create({
            message: 'Loading ...'
        });
        return await this.loading.present();
    }

    async hideLoading() {
        setTimeout(() => {
            if(this.loading != undefined){
                this.loading.dismiss();
            }
        }, 1000);
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

    logout() {
        console.log('logout clicked');
        this.storage.set("userdata", null);
        this.router.navigateByUrl('/login');
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
        this.httpClient.post(this.apiurl + "getWorkOrders.php", logged_user, {headers: headers, observe: 'response'})
            .subscribe(data => {
                this.hideLoading();
                console.log(data['body']);
                var success = data['body']['success'];
                console.log('tab page: login response was', success);

                if (success == true) {
                    var workorders = data['body']['data'];
                    console.log('tab page: workorders', workorders);
                    if (type == 'underreview') {
                        if (workorders) {
                            workorders.forEach(workorder => {
                                workorder['longdate'] = workorder['date_start'] + ' ' + workorder['time_start'];
                            });
                        }
                        //this.underreview= workorders;
                        this.underreview = data['body']['count'];
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

    refreshURCount(user_id, type) {
        var logged_user = {
            user_id: user_id,
            type: type
        }
        console.log('fetching records for', logged_user);
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.httpClient.post(this.apiurl + "getWorkOrders.php", logged_user, {headers: headers, observe: 'response'})
            .subscribe(data => {

                console.log(data['body']);
                var success = data['body']['success'];
                console.log('tab page: login response was', success);

                if (success == true) {
                    var workorders = data['body']['data'];
                    console.log('tab page: workorders', workorders);
                    if (type == 'underreview') {
                        if (workorders) {
                            workorders.forEach(workorder => {
                                workorder['longdate'] = workorder['date_start'] + ' ' + workorder['time_start'];
                            });
                        }
                        //this.underreview= workorders;
                        this.underreview = data['body']['count'];
                        //console.log('weekly services,', this.weeklyServices);
                    }
                } else {
                    console.log('failed to fetch records');
                }

            }, error => {

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
                if (userData.length == undefined) {
                    this.isLogged().then(result => {
                        if (!(result == false)) {
                            this.userinfo = result;
                            setInterval(() => {
                                console.log('refreshing under review count');
                                this.refreshURCount(this.userinfo.id, 'underreview');
                              }, 5000);
                            this.user_id = this.userinfo.id;
                        } else {
                            this.logout();
                        }
                    })
                }
            }
        });
    }
}
