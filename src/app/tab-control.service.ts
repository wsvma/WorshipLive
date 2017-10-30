import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

export interface Tab {
  id: string;
  display: string;
  link: string;
  isActive: boolean;
}

@Injectable()
export class TabControlService {

  tabs: Subject<Tab[]>;
  snapshot: Tab[] = [
    {
      id: 'worship',
      display: 'Worship',
      link: 'worship',
      isActive: true
    },
    {
      id: 'songs',
      display: 'Songs',
      link: 'songs',
      isActive: false
    }
  ];

  constructor() {
    this.tabs = new Subject<Tab[]>();
    this.tabs.next(this.snapshot);
  }

  updateTab(tab: Tab) {
    for (let i = 0; i < this.snapshot.length; i++) {
      if (this.snapshot[i].id === tab.id) {
        if (tab.isActive) {
          for (let j = 0; j < this.snapshot.length; j++)
            this.snapshot[j].isActive = false;
        }
        this.snapshot[i] = tab;
        this.tabs.next(this.snapshot);
        break;
      }
    }
  }
}
