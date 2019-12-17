import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

export class Tab {
  constructor(
    private service: TabControlService,
    public id: string,
    public display: string = '',
    public link: string = '',
    public isActive: boolean = false,
    public fullscreen: boolean = false,
    public isHidden: boolean = false) {};

  update() {
    this.service.updateTab(this);
  }

  replacer(key, value) {
    if (key === 'service')
      return undefined;

    return value;
  }

  clone() {
    return JSON.parse(JSON.stringify(this, this.replacer));
  }
}

@Injectable()
export class TabControlService {

  tabs: Subject<Tab[]>;
  snapshot: Tab[] = [
    new Tab(this, 'worship', 'Worship', 'worship', true, false, false),
    new Tab(this, 'worship-edit', '', '', false, false, true),
    new Tab(this, 'songs', 'Songs', 'songs', false, false, false),
    new Tab(this, 'song-edit', '', '', false, false, true),
    new Tab(this, 'live', 'Live Sessions', 'live', false, false, false),
    new Tab(this, 'live-control', '', '', false, false, true),
    new Tab(this, 'live-view', '', '', false, true, true),
  ];
  snapshotMap;

  constructor() {
    this.snapshotMap = {};
    for (let tab of this.snapshot)
      this.snapshotMap[tab.id] = tab;
    this.tabs = new Subject<Tab[]>();
    this.tabs.next(this.snapshot);
  }

  getTab(id) : Tab {
    return this.snapshotMap[id];
  }

  updateTab(tab: Tab) {
    if (tab.isActive) {
      this.setInactiveToAll();
      tab.isActive = true;
    }
    this.tabs.next(this.snapshot);
  }

  private setInactiveToAll() {
    for (let tab of this.snapshot)
      tab.isActive = false;
  }
}
