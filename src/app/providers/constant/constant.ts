import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants  {
   apiurl : string = 'https://www.drakelighting.com/sales/phoneapi/';
   vturl : string = 'https://www.drakelighting.com/sales/';
    getApiUrl(){
        return this.apiurl;
    }
    getVtUrl(){
        return this.vturl;
    }
}
