import { WorshipsService } from '../worships.service';
import { Observer, Subscription } from 'rxjs/Rx';
import { Worship, WorshipInDb } from '../../models/worship';
import { ActivatedRoute } from '@angular/router';
import { TabControlService } from '../tab-control.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-worship-edit',
  templateUrl: './worship-edit.component.html',
  styleUrls: ['./worship-edit.component.css']
})
export class WorshipEditComponent implements OnInit {

  tabSelected = 'worship';
  worshipId : string;
  worship : Worship;
  original : Worship;
  addNew : boolean;
  subscription : Subscription;
  errorMessage : string = "The worship is no longer in database. Someone removed it just now.";

  constructor(private tabService: TabControlService,
              private route: ActivatedRoute,
              private worshipService: WorshipsService) {
    this.worshipId = this.route.snapshot.paramMap.get('id');
    this.worship = new Worship(new WorshipInDb());
    this.original = Object.assign({}, this.worship);
    this.addNew = (this.worshipId === 'new');
  }

  updateTab() {
    this.tabService.updateTab({
      id: 'worship',
      isActive: true,
      display: 'Worship (' + this.worship.name + ')',
      link: 'worship/' + this.worshipId
    });
  }

  ngOnInit() {
    if (!this.addNew) {
      let observer : Observer<Worship> = {
        next: (worship) => {
          this.worship = worship;
          this.original = Object.assign({}, worship);
          this.updateTab();
        },
        error: (err) => {
          this.worship = null;
          this.errorMessage = err.message;
        },
        complete: () => {}
      }
      this.subscription = this.worshipService.get(this.worshipId).subscribe(observer);
    }
  }

}
