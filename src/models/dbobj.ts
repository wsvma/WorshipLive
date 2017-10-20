export class DbObjBase {
    _id: string = '';
    last_modified: string = '';
}

export interface DbObj {
    removed: boolean;
    toBaseFormat: DbObjBase;
}