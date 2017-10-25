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
  latest: Tab[] = [
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
    this.tabs.next(this.latest);
  }

  updateTab(tab: Tab) {
    for (let i = 0; i < this.latest.length; i++) {
      if (this.latest[i].id === tab.id) {
        if (tab.isActive) {
          for (let j = 0; j < this.latest.length; j++)
            this.latest[j].isActive = false;
        }
        this.latest[i] = tab;
        this.tabs.next(this.latest);
        break;
      }
    }
  }
}
