import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from  "@angular/router";
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  //TODO: have userinfo feed from storage on init.
  userinfo: any;

  constructor(private  router:  Router, private storage: Storage, private activatedRoute: ActivatedRoute) { }
 
  logout(){
    console.log('logout clicked');
    this.storage.set('loggedin', 0);
    this.router.navigateByUrl('/login');
  }

  ngOnInit(){
    this.activatedRoute.params.subscribe((userData)=>{
      this.userinfo = userData;
      console.log(userData);
    });
    console.log(this.storage);
  }
}
