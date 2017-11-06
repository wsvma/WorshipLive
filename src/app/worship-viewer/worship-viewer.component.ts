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

  pStyle = {};
  footerStyle = {};
  private viewPortToSelfRatio = 1;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  private getFontSizeInVw(size) {
    size = size / this.viewPortToSelfRatio;
    return size.toPrecision(2).toString() + 'vw';
  }

  ngAfterViewInit() {
    this.viewPortToSelfRatio = document.documentElement.clientWidth / this.container.nativeElement.clientWidth;

    this.pStyle['font-size'] = this.getFontSizeInVw(6);
    this.footerStyle['font-size'] = this.getFontSizeInVw(2);
  }
}
