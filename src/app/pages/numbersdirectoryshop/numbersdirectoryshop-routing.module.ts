import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NumbersdirectoryshopPage } from './numbersdirectoryshop.page';

const routes: Routes = [
  {
    path: '',
    component: NumbersdirectoryshopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumbersdirectoryshopPageRoutingModule {}
