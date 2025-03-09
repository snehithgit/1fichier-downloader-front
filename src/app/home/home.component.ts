import { Component } from '@angular/core';
import { File, FileService } from '../file.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private fileService: FileService) {}
  title = 'vpsdownloader';
  files: File[] = [];

  ngOnInit() {
    this.fileService.getFiles().subscribe((files) => {
      this.files = files;
    });
  }
}
