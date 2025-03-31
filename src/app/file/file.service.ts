import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  downloadStats:
    | {
        speed: number;
        progress: number;
      }
    | undefined;
}
export interface FileUpdate {
  fileId: number;
  status: string;
  speed: number;
  progress: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  getFiles(): Observable<File[]> {
    return this.http.get<File[]>(environment.apiUrl + '/files');
  }

  getDownloadingFiles(): Observable<File[]> {
    return this.http.get<File[]>(environment.apiUrl + '/files/downloading');
  }

  downloadFile(url: string): Observable<File> {
    return this.http.post<File>(environment.apiUrl + '/download/get', {
      url: url,
    });
  }
}
