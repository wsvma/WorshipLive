import { FeatherService } from '../app/feather.service';
import { Song, SongInDb } from './song';
import { DbObj, DbObjBase, EmptyDbObjBase } from './dbobj';

export class WorshipInDb extends DbObjBase {
    constructor(objInDb = EmptyDbObjBase) {
        super(objInDb);
    }
    name: string = '';
    liveId: string = '';
    itemsInDb: SongInDb[] = [];
}

export class Worship extends WorshipInDb implements DbObj {

    removed: boolean;
    service: FeatherService<Worship>;

    items: Song[] = [];

    constructor(worshipInDb: WorshipInDb = new WorshipInDb(), service = null) {
        super();
        this.service = service;
        Object.assign(this, worshipInDb);
        for (let i = 0; i < worshipInDb.itemsInDb.length; i++)
            this.items[i] = new Song(worshipInDb.itemsInDb[i]);
    }

    get toBaseFormat() : WorshipInDb {
        let worshipInDb: WorshipInDb = new WorshipInDb();
        for (let prop in worshipInDb)
            worshipInDb[prop] = this[prop];
        worshipInDb.itemsInDb = [];
        for (let i = 0; i < this.items.length; i++)
            worshipInDb.itemsInDb[i] = this.items[i].toBaseFormat;
        return worshipInDb;
    }

    isEqual(worship : Worship) {
        return JSON.stringify(this, this.replacer) == JSON.stringify(worship, this.replacer);
    }

    getClone() {
        return new Worship(this.toBaseFormat, this.service);
    }

    update() {
        if (this.service)
            return this.service.update(this);
        return null;
    }
}