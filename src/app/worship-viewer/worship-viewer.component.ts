import { LiveSession } from '../../models/live-session';
import { Worship } from '../../models/worship';
import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-worship-viewer',
  templateUrl: './worship-viewer.component.html',
  styleUrls: ['./worship-viewer.component.css']
})
export class WorshipViewerComponent {

  @Input() liveSession : LiveSession;
  @Input() worship : Worship;

  constructor() {}

  get currentItem() {
    if (this.worship && this.liveSession)
      return this.worship.items[this.liveSession.itemIndex];

    return null;
  }

  get currentPage() {
    if (this.currentItem)
      return this.currentItem.getPages()[this.liveSession.pageIndex];

    return null;
  }

  get currentParagraph() {
    if (this.currentPage)
      return this.currentPage.getParagraphs()[this.liveSession.paragraphIndex];

    return null;
  }

  moveToNextParagraph() {
    if (this.liveSession.paragraphIndex == this.currentPage.getParagraphs().length-1) {
      if (this.liveSession.pageIndex == this.currentItem.getPages().length-1) {
        return;
      }
      this.liveSession.paragraphIndex = 0;
      this.liveSession.pageIndex++;
    } else {
      this.liveSession.paragraphIndex++;
    }
  }

  moveToPrevParagraph() {
    if (this.liveSession.paragraphIndex == 0) {
      if (this.liveSession.pageIndex == 0) {
        return;
      }
      this.liveSession.pageIndex--;
      this.liveSession.paragraphIndex = this.currentPage.getParagraphs().length-1;
    } else {
      this.liveSession.paragraphIndex--;
    }
  }

  moveToPrevItem() {
    if (this.liveSession.itemIndex) {
      this.liveSession.itemIndex--;
      this.liveSession.pageIndex = 0;
      this.liveSession.paragraphIndex = 0;
    }
  }

  moveToNextItem() {
    if (this.liveSession.itemIndex < this.worship.items.length-1) {
      this.liveSession.itemIndex++;
      this.liveSession.pageIndex = 0;
      this.liveSession.paragraphIndex = 0;
    }

  }

  onKeyUp($event : KeyboardEvent) {
    switch ($event.code) {
      case "ArrowUp":
        this.moveToPrevParagraph();
        break;
      case "ArrowDown":
        this.moveToNextParagraph();
        break;
      case "ArrowLeft":
        this.moveToPrevItem();
        break;
      case "ArrowRight":
        this.moveToNextItem();
        break;
    }
  }
}
