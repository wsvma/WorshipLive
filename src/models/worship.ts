import { Song, SongInDb } from './song';
import { DbObj, DbObjBase } from './dbobj';

export class WorshipInDb extends DbObjBase {

    name: string = '';
    itemsInDb: SongInDb[] = [];
}

export class Worship extends WorshipInDb implements DbObj {

    removed: boolean;
    items: Song[] = [];

    constructor(worshipInDb: WorshipInDb) {
        super();
        Object.assign(this, worshipInDb);
        for (let i = 0; i < worshipInDb.itemsInDb.length; i++)
            this.items[i] = new Song(worshipInDb.itemsInDb[i]);
    }

    get toBaseFormat() : WorshipInDb {
        let worshipInDb: WorshipInDb = new WorshipInDb();
        for (let prop in worshipInDb)
            worshipInDb[prop] = this[prop];
        for (let i = 0; i < this.items.length; i++)
            worshipInDb.itemsInDb[i] = this.items[i].toBaseFormat;
        return worshipInDb;
    }
}