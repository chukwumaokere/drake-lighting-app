import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as pi from '../../assets/js/sampledata/properties-images.json';

@Component({
  selector: 'app-property-images',
  templateUrl: './property-images.page.html',
  styleUrls: ['./property-images.page.scss'],
})
export class PropertyImagesPage implements OnInit {
  propertyInfo: any;
  imagecounts: Object;
  propertyimages = pi.propertiesimages;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { 
  }
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
    this.activatedRoute.params.subscribe((propertyData)=>{
      console.log(propertyData);
      this.propertyInfo = propertyData;
    });
    this.getImageCounts(this.propertyInfo.recordid);
  }
}
