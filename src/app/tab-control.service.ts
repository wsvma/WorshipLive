import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

export interface Tab {
  id: string;
  display: string;
  link: string;
  isActive: boolean;
  fullscreen: boolean;
}

@Injectable()
export class TabControlService {

  tabs: Subject<Tab[]>;
  snapshot: Tab[] = [
    {
      id: 'worship',
      display: 'Worship',
      link: 'worship',
      isActive: true,
      fullscreen: false,
    },
    {
      id: 'songs',
      display: 'Songs',
      link: 'songs',
      isActive: false,
      fullscreen: false,
    },
    {
      id: 'live',
      display: 'Live Sessions',
      link: 'live',
      isActive: false,
      fullscreen: false,
    }
  ];

  constructor() {
    this.tabs = new Subject<Tab[]>();
    this.tabs.next(this.snapshot);
  }

  updateTab(tab: Tab) {
    if (tab.isActive)
      this.setInactiveToAll();
    for (let i = 0; i < this.snapshot.length; i++) {
      if (this.snapshot[i].id === tab.id) {
        this.snapshot[i] = tab;
        this.tabs.next(this.snapshot);
        return;
      }
    }
    this.snapshot.push(tab);
    this.tabs.next(this.snapshot);
  }

  patchTab(tab: Tab) {
    for (let i = 0; i < this.snapshot.length; i++) {
      if (this.snapshot[i].id === tab.id) {
        for (let prop in tab)
          if (prop != 'isActive')
            this.snapshot[i][prop] = tab[prop];
        this.tabs.next(this.snapshot);
        return;
      }
    }
    tab['isActive'] = false;
    this.snapshot.push(tab);
    this.tabs.next(this.snapshot);
  }

  removeTabsWithId(id) {
    for (let tab of this.snapshot) {
      if (tab.id === id) {
        this.removeTab(tab);
        return;
      }
    }
  }

  removeTab(tab: Tab) {
    let index = this.findTabIndex(tab);
    if (index >= 0) {
      this.snapshot.splice(index, 1);
      if (tab.isActive) {
        this.setInactiveToAll();
        if (this.snapshot.length)
          this.snapshot[0].isActive = true;
      }
      this.tabs.next(this.snapshot);
    }
  }

  private setInactiveToAll() {
    for (let tab of this.snapshot)
      tab.isActive = false;
  }

  private findTabIndex(tab) {
    for (let i = 0; i < this.snapshot.length; i++) {
      if (this.snapshot[i].id === tab.id)
        return i;
    }
    return -1;
  }
}
