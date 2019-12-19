import { FeatherService } from '../app/feather.service';

export const EmptyDbObjBase = {
    id : '',
    last_modified : '',
    date_created : ''
};

export class DbObjBase {
    id = '';
    last_modified = '';
    date_create = '';
    constructor(objInDb = EmptyDbObjBase) {
        Object.assign(this, objInDb)
    }
    replacer(key, value) {
        if (key == 'service')
            return undefined;
        return value;
    }
}

export interface DbObj {
    removed: boolean;
    toBaseFormat: DbObjBase;
    service: any;
}