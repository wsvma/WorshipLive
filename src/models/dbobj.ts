export class DbObjBase {
    _id: string = '';
    last_modified: string = '';
    date_created: string = '';
}

export interface DbObj {
    removed: boolean;
    toBaseFormat: DbObjBase;
}