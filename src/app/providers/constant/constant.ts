import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants  {
   apiurl : string = 'https://www.drakelighting.com/sales/phoneapi/';
    getApiUrl(){
        return this.apiurl;
    }
}
