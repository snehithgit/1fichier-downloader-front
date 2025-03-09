import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BaballeComponent } from './baballe/baballe.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'baballe', component: BaballeComponent },
];
