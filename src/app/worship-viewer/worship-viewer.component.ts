import { LiveController } from '../../models/live-control';
import { LiveSession } from '../../models/live-session';
import { Worship } from '../../models/worship';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-worship-viewer',
  templateUrl: './worship-viewer.component.html',
  styleUrls: ['./worship-viewer.component.css']
})
export class WorshipViewerComponent extends LiveController implements OnInit {

  @ViewChild('container') container: ElementRef;

  @Input() liveSession : LiveSession;
  @Input() worship : Worship;
  @Output() onPageChange = new EventEmitter<any>();

  style = {};

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let ratio = document.documentElement.clientWidth / this.container.nativeElement.clientWidth;
    let size = 6.5 / ratio;
    this.style['font-size'] = size.toPrecision(2).toString() + 'vw';
  }
}
