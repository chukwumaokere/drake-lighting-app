import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants  {
    apiurl : string = 'https://server.drakelighting.com/phoneapi/';
    vturl : string = 'https://server.drakelighting.com/';
    getApiUrl() {
        return this.apiurl;
    }
    getVtUrl() {
        return this.vturl;
    }
}
