import { DbObj, DbObjBase } from './dbobj';

export class LiveSessionInDb extends DbObjBase {
    itemIndex : number = 0;
    pageIndex : number = 0;
    paragraphIndex : number = 0;
}

export class LiveSession extends LiveSessionInDb implements DbObj {

    removed: boolean;

    constructor(objInDb: LiveSessionInDb) {
        super();
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
}
