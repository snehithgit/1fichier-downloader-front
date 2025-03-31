import { Component, input, Input } from '@angular/core';
import { File } from '../file.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  files = input<File[]>([]);
  @Input() downloading = false;
}
