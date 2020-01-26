import { Component, Input } from '@angular/core';

@Component({
  selector: 'entry-list',
  templateUrl: 'entry-list.html'
})
export class EntryListComponent {
  @Input() entries = [];

  constructor() { }
}
