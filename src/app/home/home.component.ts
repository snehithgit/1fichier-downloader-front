import { Component, OnInit, signal } from '@angular/core';
import { TableComponent } from '../file/table/table.component';
import { File, FileService } from '../file/file.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface FileUpdate {
  fileId: number;
  status: string;
  speed: number;
  progress: number;
}
@Component({
  selector: 'app-home',
  imports: [TableComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  files = signal<File[]>([]);
  downloadingFiles = signal<File[]>([]);

  constructor(private fileService: FileService) {
    // Mercure hub
    const url = new URL('http://localhost:3000/.well-known/mercure');
    url.searchParams.append('topic', 'file_update');

    const eventSource = new EventSource(url);
    eventSource.onmessage = (e: { data: string }) =>
      this.handleNewUpdate(JSON.parse(e.data));
  }
  title = 'vpsdownloader';
  urlToDownload = new FormControl<string>('');

  ngOnInit() {
    this.fileService.getFiles().subscribe((files) => {
      this.files.set(files);
    });

    this.fileService.getDownloadingFiles().subscribe((downloadingFiles) => {
      this.downloadingFiles.set(downloadingFiles);
    });
  }

  showUrlForm = false;
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
        if (
          this.downloadingFiles().find((f) => f.id === file.id) ||
          this.files().find((f) => f.id === file.id)
        ) {
          return;
        }

        this.downloadingFiles.set([...this.downloadingFiles(), file]);
      });
  }
}
