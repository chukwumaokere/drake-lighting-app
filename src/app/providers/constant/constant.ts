import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants  {
    apiurl : string = 'https://drake.borugroup.com/phoneapi/';
    vturl : string = 'https://drake.borugroup.com/';
    getApiUrl() {
        return this.apiurl;
    }
    getVtUrl() {
        return this.vturl;
    }
}
