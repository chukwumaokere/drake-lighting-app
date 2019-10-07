import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-property-images',
  templateUrl: './property-images.page.html',
  styleUrls: ['./property-images.page.scss'],
})
export class PropertyImagesPage implements OnInit {
  propertyInfo: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { 
  }
  goToGallery(recordid: any, galleryview: any){
    //this.router.navigate(['gallery-view', ]);
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((propertyData)=>{
      console.log(propertyData);
      this.propertyInfo = propertyData;
    })
  }
}
