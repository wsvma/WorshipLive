import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class TabDisplayService {

  latestTabDisplay: Subject<string>;

  constructor() {
    this.latestTabDisplay = new Subject<string>();
  }

  pushNewDisplay(value: string) {
    this.latestTabDisplay.next(value);
  }
}
