import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Storage} from '@ionic/storage';
import {IonInfiniteScroll} from '@ionic/angular';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
    userinfo: any;

    constructor(private activatedRoute: ActivatedRoute, private  router: Router, public storage: Storage) {
    }

    /* Default Auth Guard and Theme Loader */
    logout() {
        console.log('logging out, no user data found');
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
        document.body.classList.toggle(theme, true);
    }

    /* Default Auth Guard and Theme Loader */


    filter(e) {
        console.log(e.target.value);
        var searchterm = e.target.value.toLowerCase();
        var nodelist = document.querySelectorAll('app-map-card > ion-card');
        Array.from(nodelist).filter(function (cards) {
            console.log(cards.textContent.toLowerCase(), cards.textContent.toLowerCase().indexOf(searchterm));
            if (cards.textContent.toLowerCase().indexOf(searchterm) > -1) {
                cards.toggleAttribute('hidden', false);
            } else {
                cards.toggleAttribute('hidden', true);
            }
        });
    }

    resetFilter(e) {
        console.log(e);
        console.log('resetting filter to show all cards');
        var nodelist = document.querySelectorAll('app-map-card > ion-card');
        console.log(nodelist)
        Array.from(nodelist).filter(function (cards) {
            cards.toggleAttribute('hidden', false);
        });
    }

    getMore(e) {
        console.log('Retrieving more properties');

        setTimeout(() => {
            e.target.complete();
            console.log('New properties retrieved');
        }, 2000);
    }

    loadMore(e) {
        setTimeout(() => {
            e.target.complete();
            console.log('New properties retrieved');
            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            /*
            if (data.length == 1000) {
              e.target.disabled = true;
            }
            */
        }, 1500);
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
