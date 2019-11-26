import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import * as userjson from '../../assets/js/sampledata/users.json'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  router:  Router, public storage: Storage, public toastController: ToastController) { }

  userdata: Object;

  malformedUriErrorHandler(error: any){
    console.log(error);
  }
  
  async presentToast(message: string) {
    var toast = await this.toastController.create({
      message: message,
      duration: 3500,
      position: "top",
      color: "danger"
    });
    toast.present();
  }

  login(form: any, origin: any){
    //TODO: Wrap storage setting and data setting to API call return
     console.log('login function accessed');
    
     if(origin == 'manual'){
      console.log('login clicked');
      var data = form.value;
    /* Verify user login */
      if (userjson.users[data.email]){
        if(userjson.users[data.email].password == data.password){
          this.userdata = userjson.users[data.email];
          this.storage.ready().then(() => {
            this.storage.set('userdata', this.userdata);
            return this.router.navigate(["/tabs/services", this.userdata]);
          })
        }else{
          console.log('login failed');
          this.presentToast('Login failed. Please try again');
        }
      }else{
        console.log('login failed');
        this.presentToast('Login failed. Please try again');
      }
    /* Verify user login */
    }else if (origin == 'auto'){
      console.log('auto login from session');
      return this.router.navigate(["/tabs/services", form]);
    }

    return false;
  }

  async isLogged(){
   var log_status = this.storage.get('userdata').then((userdata) => {
      if(userdata && userdata.length !== 0){
        return userdata;
      }else{
        return false;
      }
    })
    return log_status;
  }

  movefocus(e, ref){
     if(e.key=="Enter"){
      console.log(e.key);
      ref.setFocus();
    } 
  }

  submit(e, ref){
    if(e.key=="Enter"){
     console.log('submitting');
     let el: HTMLElement = document.getElementById('submit-button') as HTMLElement;
     el.click()
    }
  }

  ngOnInit() {
    this.isLogged().then(result => {
      if (!(result == false)){
        console.log('loading storage data', result);
        this.login(result, "auto");
      }else{
        console.log('init login failed');
      }
    })
  }
}
