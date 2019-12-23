import { Component, OnInit, LOCALE_ID, Inject, ViewChild ,ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from  '@angular/router';
import {NavController, ToastController, AlertController, ModalController, Platform} from '@ionic/angular';
import { AppConstants } from '../../providers/constant/constant';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    CameraPosition,
    MarkerOptions,
    Marker,
    Environment
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-jha',
  templateUrl: './jha.page.html',
  styleUrls: ['./jha.page.scss'],
})

export class JhaPage implements OnInit {
    apiurl:any;
    lat: any;
    long:any;
    serviceid:any;
    job_name: any;
    data: any = {};
    places : Array<any> ;
    map: GoogleMap;
    constructor(
        private modalController: ModalController,
        public httpClient: HttpClient,
        public platform: Platform,
        public toastController: ToastController,
        private  router:  Router,
        public appConst: AppConstants,
        public route: ActivatedRoute
    ){
        this.apiurl = this.appConst.getApiUrl();
    }

    /*async ngOnInit() {
      this.route.queryParams
          .subscribe(params => {
              console.log(params);
              for(let key in params){
                console.log(key);
                if(params[key] != undefined){
                    this.data[key] = params[key];
                }
              }
              this.lat = params.lat;
              this.long = params.long;
              this.serviceid = params.serviceid;
              this.job_name = params.job_name;
              this.serviceid = params.serviceid;
              this.loadMap(this.lat, this.long);
          });
  }*/

    async ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                console.log(params);
                for(let key in params){
                    console.log(key);
                    if(params[key] != undefined){
                        this.data[key] = params[key];
                    }
                }
                this.lat = params.lat;
                this.long = params.long;
                this.serviceid = params.serviceid;
                this.job_name = params.job_name;
                this.serviceid = params.serviceid;
            });

        // Since ngOnInit() is executed before `deviceready` event,
        // you have to wait the event.
        await this.platform.ready();
        await this.loadMap();
    }
    loadMap() {
        console.log('load Map');
        this.map = GoogleMaps.create('map_canvas', {
            camera: {
                target: {
                    lat: this.lat,
                    lng: this.long
                },
                zoom: 18,
                tilt: 30
            }
        });

    }

    /*addMap(lat, long) {
        console.log(lat);
        console.log(long);
        let latLng = new google.maps.LatLng(lat,long);
        console.log(latLng);
        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        /!*this.getHospital(latLng).then((results : Array<any>)=>{
            this.places = results;
            for(let i = 0 ;i < results.length ; i++) {
                this.createMarker(results[i]);
            }
        },(status)=>console.log(status));*!/

        this.addMarker();

    }
    addMarker() {

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });

        let content = "<p>This is your current position !</p>";
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }
    getHospital(latLng) {
        var service = new google.maps.places.PlacesService(this.map);
        let request = {
            location : latLng,
            radius : 8047 ,
            types: ["hospital"]
        };
        return new Promise((resolve,reject)=>{
            service.nearbySearch(request,function(results,status){
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(status);
                }

            });
        });

    }
    createMarker(place) {
        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location
        });
    }*/

    gotoJHAHospital() {
        this.router.navigate(['services/jha-hospital'], { queryParams: {serviceid: this.serviceid, lat: this.data["lat"], long: this.data["long"], job_name: this.data["job_name"]} });
    }
    addUpdate(event) {
        var fieldname = event.target.name;
        var fieldvalue =  event.target.value;
        if (event.target.tagName == 'ION-INPUT'){
            fieldvalue = event.target.textContent + event.target.value;
        }
        this.data[fieldname] = fieldvalue;
        console.log(this.data);
    }

}
