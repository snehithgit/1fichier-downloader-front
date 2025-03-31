import { Component, signal, OnInit } from '@angular/core';
import { File, FileService } from '../file.service';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-list',
  imports: [TableComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  files = signal<File[]>([]);
  showUrlForm = false;

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.fileService.getFiles().subscribe((files) => {
      this.files.set(files);
    });
  }
}
