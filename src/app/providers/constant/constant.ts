import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants  {
    apiurl : string = 'http://devl06.borugroup.com/drakelighting/phoneapi/';
    vturl : string = 'http://devl06.borugroup.com/drakelighting/';
    getApiUrl() {
        return this.apiurl;
    }
    getVtUrl() {
        return this.vturl;
    }
}
