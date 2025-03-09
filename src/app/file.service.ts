import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface File {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  url: string;
  filename: string;
  size: number;
  date: string;
  contentType: string;
  checksum: string;
  downloaded: boolean;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  getFiles(): Observable<File[]> {
    return this.http.get<File[]>(environment.apiUrl + '/files');
  }
}
