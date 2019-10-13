import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  
  constructor() {}
  
  filter(e){
    console.log(e.target.value);
    var searchterm = e.target.value.toLowerCase();
    var nodelist = document.querySelectorAll('app-map-card > ion-card');
    Array.from(nodelist).filter(function(cards){
      console.log(cards.textContent.toLowerCase(), cards.textContent.toLowerCase().indexOf(searchterm));
      if(cards.textContent.toLowerCase().indexOf(searchterm) > -1){
        cards.toggleAttribute('hidden', false);
      }else{
        cards.toggleAttribute('hidden', true);
      }
    });
  }
  
  resetFilter(e){
    console.log(e);
    console.log('resetting filter to show all cards');
    var nodelist = document.querySelectorAll('app-map-card > ion-card');
    console.log(nodelist)
    Array.from(nodelist).filter(function(cards){
      cards.toggleAttribute('hidden', false);
    });
  }

  ngOnInit(){

  }
}
