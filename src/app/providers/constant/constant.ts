import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants  {
   apiurl : string = 'http://devl06.borugroup.com/drakelighting/phoneapi/';
    getApiUrl(){
        return this.apiurl;
    }
}
