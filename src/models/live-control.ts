import { EventEmitter } from '@angular/core';
import { Worship } from './worship';
import { LiveSession } from './live-session';

export class LiveController {

    protected worship : Worship;
    protected liveSession : LiveSession;
    protected onPageChange : EventEmitter<any>;

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
        this.liveSession.update();
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
        this.liveSession.update();
    }

    moveToPrevItem() {
        if (this.liveSession.itemIndex) {
            this.liveSession.itemIndex--;
            this.liveSession.pageIndex = 0;
            this.liveSession.paragraphIndex = 0;
        }
        this.liveSession.update();
    }

    moveToNextItem() {
        if (this.liveSession.itemIndex < this.worship.items.length-1) {
            this.liveSession.itemIndex++;
            this.liveSession.pageIndex = 0;
            this.liveSession.paragraphIndex = 0;
        }
        this.liveSession.update();
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

    private update() {
        this.liveSession.update();
        if (this.onPageChange)
            this.onPageChange.next();
    }

    setIndices(itemIdx, pageIdx, paraIdx) {
        this.liveSession.setIndices(itemIdx, pageIdx, paraIdx);
    }
}