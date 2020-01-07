import {Component, OnInit, LOCALE_ID, Inject, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NavController, AlertController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {formatDate} from '@angular/common';
import {CalendarComponent} from 'ionic2-calendar/calendar';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConstants} from '../providers/constant/constant';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    //TODO: have userinfo feed from storage on init.
    userinfo: any;
    nextId: any = 51;
    event = {
        //id: this.nextId,
        id: '',
        title: '',
        desc: '',
        startTime: '',
        endTime: '',
        allDay: false
    };
    minDate = new Date().toISOString();
    eventSource = [];
    viewTitle: any;

    calendar = {
        mode: 'month',
        currentDate: new Date(),
    };
    apiurl: any;
    @ViewChild(CalendarComponent, <any>[]) myCal: CalendarComponent;

    constructor(
        private httpClient: HttpClient,
        public navCtrl: NavController,
        private router: Router,
        public storage: Storage,
        private activatedRoute: ActivatedRoute,
        public appConst: AppConstants,
        private alertCtrl: AlertController, @Inject(LOCALE_ID)
        private locale: string,
        public loadingController: LoadingController
    ) {
        this.apiurl = this.appConst.getApiUrl();
    }

    loadEvents() {
        this.eventSource = this.createRandomEvents();
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

    getWorkOrders(user_id) {
        var events = [];
        var logged_user = {
            user_id: user_id
        }
        console.log('fetching records for', logged_user);
        var headers = new HttpHeaders();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Access-Control-Allow-Origin', '*');
        this.showLoading();
        this.httpClient.post(this.apiurl + "getCalendar.php", logged_user, {headers: headers, observe: 'response'})
            .subscribe(data => {
                this.hideLoading();
                console.log(data['body']);
                var success = data['body']['success'];
                console.log('tab2 page: login response was', success);

                if (success == true) {
                    var workorders = data['body']['data'];
                    console.log('tab2 page: workorders', workorders);
                    workorders.forEach(workorder => {
                        workorder.startTimeRaw = workorder.startTime;
                        workorder.endTimeRaw = workorder.endTime;
                        workorder.startTime = new Date(workorder.startTime);
                        workorder.endTime = new Date(workorder.endTime);
                        workorder.allDay = false;
                        workorder.id = workorder.workorderid;
                        workorder.title = workorder[0].substring(0, 25);
                        workorder.desc = workorder.towersites;
                    });
                    //TODO: Fix the date being start of epoch time.
                    this.eventSource = workorders;
                    console.log('eventsource: ', this.eventSource);
                } else {
                    //this.hideLoading();
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

    randomCompany = ['Simmons - MOSPG2014', 'Marysville - ARLIT2062', 'Coldspring - TXHOU2041', 'Yellow Rock - KYLEX2020', 'Medora - ILSPG2027', 'Lawtell - LALWL2000', 'HWY 584 (FTCA) LAMON2002', 'HWY 120 (FTCA) - LASRV2006', 'York - ALBRH2003', 'Jorge Auto Sales - TXLAR2007', 'Sawmill - ARLIT2065', 'Saxton - PAPIT2008', 'Rockwood - PAPIT2006', 'Mellen - WIWAU2029', 'Calvin - LAMON2113', 'Funston - LARSV2021'];

    createRandomEvents() {
        var events = [];
        for (var i = 0; i < 50; i += 1) {
            var randomC = i + 1;
            if (randomC > 16) {
                randomC = i % 16;
            }
            var date = new Date();
            var eventType = Math.floor(Math.random() * 2);
            var startDay = Math.floor(Math.random() * 90) - 45;
            var endDay = Math.floor(Math.random() * 2) + startDay;
            var startTime;
            var endTime;
            var desc = 'Just a random Description for this work order ' + ' - ' + i;
            if (eventType === 0) {
                startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                if (endDay === startDay) {
                    endDay += 1;
                }
                endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                events.push({
                    id: i,
                    title: '' + this.randomCompany[randomC],
                    desc: desc,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: true
                });
            } else {
                var startMinute = Math.floor(Math.random() * 24 * 60);
                var endMinute = Math.floor(Math.random() * 180) + startMinute;
                startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                events.push({
                    id: i,
                    title: '' + this.randomCompany[randomC],
                    desc: desc,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false
                });
            }
        }
        return events;
    }

    resetEvent() {
        var nextId = this.nextId;
        this.event = {
            id: nextId,
            title: '',
            desc: '',
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            allDay: false
        };
    }

    // Create the right event format and reload source
    addEvent(events: object) {
        let eventCopy = {
            id: this.event.id,
            title: this.event.title,
            startTime: new Date(this.event.startTime),
            endTime: new Date(this.event.endTime),
            allDay: this.event.allDay,
            desc: this.event.desc
        }

        if (eventCopy.allDay) {
            let start = eventCopy.startTime;
            let end = eventCopy.endTime;

            eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
            eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
        }

        this.eventSource.push(eventCopy);
        this.myCal.loadEvents();
        this.nextId = this.nextId + 1;
        //console.log('incrementing id to', this.nextId);
        this.resetEvent();
    }

    // Change current month/week/day
    next() {
        var swiper = document.querySelector('.swiper-container')['swiper'];
        swiper.slideNext();
    }

    back() {
        var swiper = document.querySelector('.swiper-container')['swiper'];
        swiper.slidePrev();
    }

    // Change between month/week/day
    changeMode(mode) {
        this.calendar.mode = mode;
    }

    // Focus today
    today() {
        this.changeMode('month');
        this.calendar.currentDate = new Date();
    }

    // Selected date reange and hence title changed
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    // Calendar event was clicked
    async onEventSelected(event) {
        // Use Angular date pipe for conversion
        let start = formatDate(event.startTime, 'medium', this.locale);
        let end = formatDate(event.endTime, 'medium', this.locale);

        const alert = await this.alertCtrl.create({
            header: event.title,
            subHeader: event.desc,
            message: 'From: ' + start + '<br><br>To: ' + end,
            buttons: [{text: 'Close', role: 'cancel'}, {
                text: 'Open Work Order', handler: () => {
                    console.log('Going to service record ID: ', event.id);
                    this.router.navigateByUrl(`/services/detail/${event.id}`, {state: {}});
                }
            }]
        });
        alert.present();
    }

    // Time slot was clicked
    onTimeSelected(ev) {
        let selected = new Date(ev.selectedTime);
        this.event.startTime = selected.toISOString();
        selected.setHours(selected.getHours() + 1);
        this.event.endTime = (selected.toISOString());
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

    ngOnInit() {
        this.activatedRoute.params.subscribe((userData) => {
            if (userData.length !== 0) {
                this.userinfo = userData;
                console.log('param user data:', userData);
                try {
                    this.loadTheme(userData.theme.toLowerCase());
                } catch {
                    console.log('couldnt load theme');
                }
                console.log('param user data length:', userData.length);
                if (userData.length == undefined) {
                    console.log('nothing in params, so loading from storage');
                    this.isLogged().then(result => {
                        if (!(result == false)) {
                            console.log('loading storage data (within param route function)', result);
                            this.userinfo = result;
                            this.loadTheme(result.theme.toLowerCase());
                            this.getWorkOrders(this.userinfo.id);
                        } else {
                            console.log('nothing in storage, going back to login');
                            this.logout();
                        }
                    });
                }
            }
        });
        //this.loadEvents();
    }

}
