import { Component, OnInit, LOCALE_ID, Inject, } from '@angular/core';
import { ActivatedRoute, Router } from  "@angular/router";
import { NavController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  userinfo: any;
  todayServices: object;
  futureServices: object;
  completedServices: object;
  service = {
    id: '',
    title: '', //Will be the Transferee + type of service
    desc: '', //Will be address here
    longdate: '',
    startTime: '', //Will be time as 00:00 A/PM
    endTime: '', //Will be time as 00:00 A/PM
    status: '',
  };

  randomPeople = ['Malik','Charisse','Mitsue','Lilia','Lynelle','Lavette','Kerry','Beckie','Nathan','Kristle','Nickie','Coretta','Randy','Carmon','Bev','Maude','Cleora','Tracy','Casimira','Lowell','Particia','Bennie','Angelena','Elden','Marcel','Elene','Young','Rheba','Paulene','Latia','Shantay','Lavon','Dane','Darla','Joselyn','Zelda','Kasha','Kaitlin','Pasty','Essie','Delfina','Arla','Amy','Xavier','Jin','Ashlee','Millicent','Jeanetta','Willy','Rolf',];
  typesOfServices= ['Quick Start', 'Discard and Donate', 'Move IN Clean', 'Quick Start Exec', 'Move OUT Clean'];
  statuses= ['1 In-Process', 'Declined', 'Complete', 'Cancelled', 'Closed', 'Approved'];

  constructor(public navCtrl: NavController, private  router:  Router, public storage: Storage, private activatedRoute: ActivatedRoute, @Inject(LOCALE_ID) private locale: string) { }

  async loadRandomServices(type){
    var limit = 50;
    var init = 0;
    if(type == 'today'){
      var limit = 5;
    }else if (type == 'future'){
      var limit = 10;
      init = 5;
    }else if (type == 'completed'){
      init = 15;
    }
    var services = [];
    for (var i = init; i < limit; i += 1){
      var date = new Date();
      var startDay = Math.floor(Math.random() * 90) - 45;
      var endDay = Math.floor(Math.random() * 2) + startDay;
      var startTime;
      var endTime;
      var desc;
      var startMinute = Math.floor(Math.random() * 24 * 60);
      var endMinute = Math.floor(Math.random() * 180) + startMinute;
      startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
      endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
      var randomTOS = i % this.typesOfServices.length;
      var randomStatus = i % this.statuses.length;
      let start = formatDate(startTime, 'shortTime', this.locale);
      let end = formatDate(endTime, 'shortTime', this.locale);
      let longdate = formatDate(startTime, 'medium', this.locale);
      var availableStatuses = this.statuses;
      var status = this.statuses[randomStatus];
      if (type=='today'){
        var availableStatuses= ['1 In-Process', 'Cancelled', 'Approved'];
      }
      if (type == 'future'){
        var availableStatuses= ['Cancelled', 'Approved', 'Declined',];
      }
      var status=availableStatuses[i%availableStatuses.length];
      if(type=='completed'){
        var status = 'Completed';
      }
      services.push({
        id: i,
        title: this.randomPeople[i] + ': ' + this.typesOfServices[randomTOS],
        desc: '',
        longdate: longdate,
        startTime: start,
        endTime: end,
        status: status,
      }); 
    }
    return services;
  }
  
  logout(){
    console.log('logout clicked');
    this.storage.set("userdata", null);
    this.router.navigateByUrl('/login');
  }

  async getCurrentTheme(){
    var current_theme = this.storage.get('userdata').then((userdata) => {
      if(userdata && userdata.length !== 0){
        //current_theme = userdata.theme.toLowerCase();
        return userdata.theme.toLowerCase();
      }else{
        return false;
      }
    })
    return current_theme;
  }

  async updateCurrentTheme(theme: string){
    var userjson: object;
    await this.isLogged().then(result => {
      if (!(result == false)){
        userjson = result;
      }
    })
    //console.log('from set current theme', userjson.theme);
    userjson['theme'] = theme.charAt(0).toUpperCase() + theme.slice(1);
    //console.log('from set current theme', userjson);
    this.storage.set('userdata', userjson);
    this.userinfo.theme= theme.charAt(0).toUpperCase() + theme.slice(1);
    console.log('updated theme on storage memory');
  }

   async switchTheme(){
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

   loadTheme(theme){
    console.log('loading theme', theme);
    document.body.classList.toggle(theme, true);
    var theme_switcher = {
      "dark": "light", 
      "light": "dark"
    };
    document.body.classList.toggle(theme_switcher[theme], false); //switch off previous theme if there was one and prefer the loaded theme.
    console.log('turning off previous theme', theme_switcher[theme]);
   }

  ngOnInit(){
    this.activatedRoute.params.subscribe((userData)=>{
     if(userData.length !== 0){
       this.userinfo = userData;
       console.log('param user data:', userData);
       try{ 
         this.loadTheme(userData.theme.toLowerCase());
       }catch{
         console.log('couldnt load theme');
       }
       console.log('param user data length:', userData.length);
       if(userData.length == undefined){
         console.log ('nothing in params, so loading from storage');
         this.isLogged().then(result => {
           if (!(result == false)){
             console.log('loading storage data (within param route function)', result);
             this.userinfo = result;
             this.loadTheme(result.theme.toLowerCase());
           }else{
             console.log('nothing in storage, going back to login');
             this.logout();
           }
         }); 
       }
     }
   }); 
   this.loadRandomServices('today').then((result) => { this.todayServices= result; });
   this.loadRandomServices('future').then((result) => { this.futureServices= result; });
   this.loadRandomServices('completed').then((result) => { this.completedServices= result; });
 }

}
