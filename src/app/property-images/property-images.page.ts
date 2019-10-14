import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as pi from '../../assets/js/sampledata/properties-images.json';

@Component({
  selector: 'app-property-images',
  templateUrl: './property-images.page.html',
  styleUrls: ['./property-images.page.scss'],
})
export class PropertyImagesPage implements OnInit {
  propertyInfo: any;
  imagecounts: Object;
  userinfo: any;
  propertyimages = pi.propertiesimages;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, public storage: Storage) { 
  }

   /* Default Auth Guard and Theme Loader */
   logout(){
    console.log('logging out, no user data found');
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
    document.body.classList.toggle(theme, true);
   }

  /* Default Auth Guard and Theme Loader */

  goToGallery(recordid: any, galleryview: any, property: any){
    //this.router.navigate(['gallery', {recordid: recordid, gallery: galleryview, property: property}]); --deprecated--
    this.router.navigateByUrl(`/gallery/${recordid}/${galleryview}`, {state: {property: property}});
  }
  getImageCounts(recordid: any){
    console.log('getting image counts for', recordid);
    var images = this.propertyimages.filter(object => {
      return object.recordid == recordid;
    }); 
    console.log(images[0].rooms);
    this.imagecounts = images[0].rooms;
  }
  ngOnInit() {
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
    this.activatedRoute.params.subscribe((propertyData)=>{
      console.log(propertyData);
      this.propertyInfo = propertyData;
    });
    this.getImageCounts(this.propertyInfo.recordid);
  }
}
