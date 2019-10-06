import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { properties } from '../../assets/js/sampledata/properties.json';

@Component({
  selector: 'app-map-card',
  templateUrl: './map-card.component.html',
  styleUrls: ['./map-card.component.scss'],
})
export class MapCardComponent implements OnInit {
  properties: Object;

  constructor(private  router:  Router) { 
   
  }
  getProperties() {
    this.properties = properties;
  }
  detailView(property: any){
    this.router.navigate(['property-images', property]);
  }
  ngOnInit() {
    this.getProperties();
  }

}
