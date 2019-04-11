import { Component, Input } from '@angular/core';

@Component({
  selector: 'last-fm-internal-eq',
  template: `
    <div class="equalizer-container">
      <ol *ngFor="let barIndex of Arr(numberOfBars).fill(1)" class="equalizer-column">
        <li class="color-bar" [style.backgroundColor]="color"></li>
      </ol>
    </div>
  `,
  styleUrls: ['./equalizer.component.scss']
})
export class LastFmInternalEqComponent {
  @Input() color;
  numberOfBars = 100;
  Arr = Array;
}
