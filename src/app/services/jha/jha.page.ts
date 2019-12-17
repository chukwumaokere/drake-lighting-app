import { Component, OnInit, LOCALE_ID, Inject, } from '@angular/core';
import { ActivatedRoute, Router } from  '@angular/router';
import {NavController, ToastController, AlertController, ModalController} from '@ionic/angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ChecklistModalPage } from '../checklist-modal/checklist-modal.page';
import { ImageProvider } from '../../providers/image/image';
import { AppConstants } from '../../providers/constant/constant';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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
    constructor(
        private modalController: ModalController,
        public httpClient: HttpClient,
        public toastController: ToastController,
        public appConst: AppConstants,
        public route: ActivatedRoute
    ){
        this.apiurl = this.appConst.getApiUrl();
    }

  ngOnInit() {
      this.route.queryParams
          .subscribe(params => {
              console.log(params); // {order: "popular"}
              this.lat = params.lat;
              this.long = params.long;
              this.serviceid = params.serviceid;
          });
  }

}
