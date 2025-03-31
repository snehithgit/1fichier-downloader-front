import { Component, signal, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { File, FileService, FileUpdate } from '../file.service';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-download',
  imports: [TableComponent, ReactiveFormsModule],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss',
})
export class DownloadComponent implements OnInit {
  downloadingFiles = signal<File[]>([]);
  showUrlForm = false;

  constructor(private fileService: FileService) {
    // Mercure hub
    const url = new URL(environment.mercureUrl);
    url.searchParams.append('topic', 'file_update');

    const eventSource = new EventSource(url);
    eventSource.onmessage = (e: { data: string }) =>
      this.handleNewUpdate(JSON.parse(e.data));
  }
  title = 'vpsdownloader';
  urlToDownload = new FormControl<string>('');

  ngOnInit() {
    this.fileService.getDownloadingFiles().subscribe((downloadingFiles) => {
      this.downloadingFiles.set(downloadingFiles);
    });
  }

  handleNewUpdate(data: FileUpdate): void {
    const file = this.downloadingFiles().find((f) => f.id === data.fileId);
    if (!file) {
      return;
    }

    file.status = data.status;
    file.downloadStats = {
      speed: data.speed,
      progress: data.progress,
    };

    if (data.status === 'downloaded') {
      file.downloaded = true;
    }
    this.downloadingFiles.set([...this.downloadingFiles()]);
  }

  openUrlForm(): void {
    this.showUrlForm = !this.showUrlForm;
  }

  downloadFile(): void {
    if (!this.urlToDownload.value) {
      return;
    }
    this.fileService
      .downloadFile(this.urlToDownload.value)
      .subscribe((file) => {
        // reset urlToDownload and hide forms
        this.urlToDownload.setValue('');
        this.showUrlForm = false;
        // check if file is already in downloadingFiles or files
        if (this.downloadingFiles().find((f) => f.id === file.id)) {
          return;
        }

        this.downloadingFiles.set([...this.downloadingFiles(), file]);
      });
  }
}
