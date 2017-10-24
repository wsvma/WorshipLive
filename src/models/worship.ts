import { Song } from './song';
import { DbObj, DbObjBase } from './dbobj';

export class Style {
    fontSize: string;
}

export class DisplayItem {
    style: Style;
    item: Song;
}

export class WorshipInDb extends DbObjBase {

    name: string = '';
    items: DisplayItem[] = [];
}

export class Worship extends WorshipInDb implements DbObj {

    removed: boolean;

    constructor(worshipInDb: WorshipInDb) {
        super();
        Object.assign(this, worshipInDb);
    }

    get toBaseFormat() : WorshipInDb {
        let worshipInDb: WorshipInDb = new WorshipInDb();
        for (let prop in worshipInDb)
            worshipInDb[prop] = this[prop];
        return worshipInDb;
    }
}