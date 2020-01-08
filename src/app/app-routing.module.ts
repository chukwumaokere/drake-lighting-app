import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'property-images', loadChildren: './property-images/property-images.module#PropertyImagesPageModule' },
  { path: 'services/detail/:serviceid/gallery', loadChildren: './gallery/gallery.module#GalleryPageModule' },
  { path: 'services', loadChildren: './services/services.module#ServicesPageModule' },
  { path: 'ratings', loadChildren: './ratings/ratings.module#RatingsPageModule' },
  { path: 'services/detail/:serviceid', loadChildren: './services/detail/detail.module#DetailPageModule' },
  { path: 'underreview', loadChildren: './underreview/underreview.module#UnderreviewPageModule' },
  { path: 'services/jha', loadChildren: './services/jha/jha.module#JhaPageModule' },
  { path: 'services/jha-hospital', loadChildren: './services/jha-hospital/jha-hospital.module#JhaHospitalPageModule' }







];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
