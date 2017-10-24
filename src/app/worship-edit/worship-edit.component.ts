import { WorshipsService } from '../worships.service';
import { Observer, Subscription } from 'rxjs/Rx';
import { Worship, WorshipInDb } from '../../models/worship';
import { ActivatedRoute } from '@angular/router';
import { TabDisplayService } from '../tab-display.service';
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

  constructor(private tabService: TabDisplayService,
              private route: ActivatedRoute,
              private worshipService: WorshipsService) {
    this.worshipId = this.route.snapshot.paramMap.get('id');
    this.worship = new Worship(new WorshipInDb());
    this.original = Object.assign({}, this.worship);
    this.addNew = (this.worshipId === 'new');
  }

  get tabDisplay() {
    if (this.worship.name)
      return 'Worship (' + this.worship.name + ')';
    return 'Worship (New)';
  }

  onKeyUp($event: KeyboardEvent) {
    this.tabService.pushNewDisplay(this.tabDisplay);
  }

  ngOnInit() {
    this.tabService.pushNewDisplay('Worship');
    if (!this.addNew) {
      let observer : Observer<Worship> = {
        next: (worship) => {
          this.worship = worship;
          this.original = Object.assign({}, worship);
          this.tabService.pushNewDisplay(this.tabDisplay);
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
