import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private  router:  Router, private storage: Storage) { }
  
  isLogged: boolean;

  userdata: Object;

  malformedUriErrorHandler(error){
    console.log(error);
  }
  
  login(form: any){
    //TODO: Wrap storage setting and data setting to API call return
    // console.log('login clicked');
     var data = form.value;
    // /* needs to be wrapped in a Vtiger API call */
    //   this.storage.set('user', data.email);
    //   this.storage.set('name', data.email);
    //   this.storage.set('loggedin', true);
       this.userdata = {
         "user": data.email,
         "name": data.email
       };
    //   this.isLogged = true;
    //   console.log(this.isLogged);
    //   console.log(this.userdata);
    /* needs to be wrapped in a Vtiger API call */

    //this.router.navigateByUrl("/tabs/tab2"); -- deprecated --
    this.router.navigate(["/tabs/tab2", this.userdata]);
  }
  async isLoggedIn(){
    var log_status = await this.storage.get('loggedin').then((result) => {
      if (result == true){
        this.isLogged = true;
        return result;
      }else{
        this.isLogged = false;
        return result;
      }
    });
  }
  getLoggedStatus(){
    return this.isLogged;
  }
  ngOnInit() {
    //TODO: On init, check for if currently logged in to auto-log in
    /* console.log('logged status', this.getLoggedStatus());
    console.log('isloggedin', this.isLoggedIn());
    console.log('are you logged', this.isLogged);
    console.log('userdata', this.userdata) */
  }

}
