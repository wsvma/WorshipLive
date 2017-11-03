import { LiveController } from '../../models/live-control';
import { LiveSession } from '../../models/live-session';
import { Worship } from '../../models/worship';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-worship-viewer',
  templateUrl: './worship-viewer.component.html',
  styleUrls: ['./worship-viewer.component.css']
})
export class WorshipViewerComponent extends LiveController {

  @Input() liveSession : LiveSession;
  @Input() worship : Worship;
  @Output() onPageChange = new EventEmitter<any>();

  constructor() {
    super();
  }
}
