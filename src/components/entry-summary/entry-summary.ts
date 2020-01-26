import { Component, Input } from '@angular/core';

@Component({
  selector: 'entry-summary',
  templateUrl: 'entry-summary.html'
})
export class EntrySummaryComponent {
  @Input() entries = [];
  constructor() { }
}
