import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private  router:  Router) { }

  malformedUriErrorHandler(error){
    console.log(error);
  }
  login(form){
    this.router.navigateByUrl("/tabs/tab2");
  }
  ngOnInit() {
   
  }

}
