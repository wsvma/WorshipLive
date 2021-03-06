import { DbDataService } from '../app/dbdata.service';
import { DbObj, DbObjBase, EmptyDbObjBase } from './dbobj';

export class LiveSessionInDb extends DbObjBase {
    constructor(objInDb = EmptyDbObjBase) {
        super(objInDb);
    }
    itemIndex : number = 0;
    pageIndex : number = 0;
    paragraphIndex : number = 0;
    worshipId : string = '';
    worshipName: string = '';
}

export class LiveSession extends LiveSessionInDb implements DbObj {

    removed: boolean;
    service: DbDataService<LiveSession>;

    constructor(objInDb: LiveSessionInDb = new LiveSessionInDb(), service = null) {
        super();
        this.service = service;
        for (let prop in objInDb)
            if (Array.isArray(objInDb[prop]))
                this[prop] = objInDb[prop].slice();
            else
                this[prop] = objInDb[prop];
    }

    get toBaseFormat() {
        let objInDb: LiveSessionInDb = new LiveSessionInDb();
        for (let prop in objInDb)
            if (Array.isArray(objInDb[prop]))
                objInDb[prop] = this[prop].slice();
            else
                objInDb[prop] = this[prop];
        return objInDb;
    }

    update() {
        if (this.service)
            return this.service.update(this);
        return null;
    }

    getControlTab(isActive = false) {
        return {
            id: 'live',
            display: 'Live (' + this.worshipName + ')',
            isActive: isActive,
            link: 'live-control/' + this.id,
            fullscreen: false,
        };
    }

    setIndices(itemIdx, pageIdx, paraIdx) {
        this.itemIndex = itemIdx;
        this.pageIndex = pageIdx;
        this.paragraphIndex = paraIdx;
    }
}
