import { Observer } from 'rxjs/Rx';
import { Worship } from '../../models/worship';
import { WorshipsService } from '../worships.service';
import { SharedStateService } from '../shared-state.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-worship-viewer',
  templateUrl: './worship-viewer.component.html',
  styleUrls: ['./worship-viewer.component.css']
})
export class WorshipViewerComponent implements OnInit {

  @Input() worshipId : string = '';
  @Input() worshipFromDb : boolean = true;

  worship: Worship;

  constructor(private state: SharedStateService,
              private worshipsService: WorshipsService) {}

  ngOnInit() {
    let observer : Observer<Worship> = {
      next: (worship) => {
        this.worship = worship;
      },
      error: (err) => {
        this.worship = null;
      },
      complete: () => {}
    }
    if (this.worshipFromDb) {
      this.worshipsService.get(this.worshipId).subscribe(observer);
    } else {
      this.state.activeWorship.getObservable().subscribe(observer);
    }

  }

}
