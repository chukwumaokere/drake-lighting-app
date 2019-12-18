import { Component, OnInit, LOCALE_ID, Inject, ViewChild ,ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from  '@angular/router';
import {NavController, ToastController, AlertController, ModalController} from '@ionic/angular';
import { AppConstants } from '../../providers/constant/constant';
import {HttpClient, HttpHeaders} from '@angular/common/http';
//import { Geolocation , GeolocationOptions , Geoposition } from '@ionic-native/geolocation';
declare var google;

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
    /*options : GeolocationOptions;
    currentPos : Geoposition;*/
    places : Array<any> ;
    @ViewChild('map', <any>[]) mapElement: ElementRef;
    map: any;
    constructor(
        private modalController: ModalController,
        public httpClient: HttpClient,
        public toastController: ToastController,
        public appConst: AppConstants,
        //private geolocation : Geolocation,
        public route: ActivatedRoute
    ){
        this.apiurl = this.appConst.getApiUrl();
    }

  ngOnInit() {
      this.route.queryParams
          .subscribe(params => {
              console.log(params); // {order: "popular"}
              this.lat = params.lat;
              this.lat = 42.786389;
              this.long = params.long;
              this.long = -96.82187;
              this.serviceid = params.serviceid;
              this.addMap(this.lat, this.long);
          });
  }
    /*getUserPosition(){
        this.options = {
            enableHighAccuracy : false
        };
        this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

            this.currentPos = pos;

            console.log(pos);
            this.addMap(pos.coords.latitude,pos.coords.longitude);

        },(err : PositionError)=>{
            console.log("error : " + err.message);
        })
    }

    ionViewDidEnter(){
       this.getUserPosition();
    }*/

    addMap(lat,long) {

        let latLng = new google.maps.LatLng(lat, long);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.getHospital(latLng).then((results : Array<any>)=>{
            this.places = results;
            for(let i = 0 ;i < results.length ; i++) {
                this.createMarker(results[i]);
            }
        },(status)=>console.log(status));

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
    }

}
