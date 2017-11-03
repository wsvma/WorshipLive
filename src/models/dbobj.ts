import { FeatherService } from '../app/feather.service';
export class DbObjBase {
    _id: string = '';
    last_modified: string = '';
    date_created: string = '';
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