import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './file/list/list.component';
import { DownloadComponent } from './file/download/download.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'files', component: ListComponent },
  { path: 'downloads', component: DownloadComponent },
];
