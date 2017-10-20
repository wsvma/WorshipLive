import { DbObj, DbObjBase } from './dbobj';
import * as countWord from 'wordcount';
import * as hasChinese from 'has-chinese';
import { toMyDateFormat } from '../utils/utils'

export class SongInDb extends DbObjBase {
    title_1: string = '';
    title_2: string = '';
    writer: string = '';
    copyright: string = '';
    lyrics: string = '';
    sequence: string = '';
    key: string = '';
    category: string = '';
    numwords: number = 0;
    capo: string = '';
    timing: string = '';
    license_admin1: string = '';
    license_admin2: string = '';
}

export class Song extends SongInDb implements DbObj {

    removed: boolean;

    constructor(songInDb: SongInDb) {
        super();
        Object.assign(this, songInDb);
    }

    get title() : string {
        if (this.title_2)
            return this.title_1 + ' | ' + this.title_2;
        return this.title_1;
    }

    get last_modified_iso() {
        return toMyDateFormat(new Date(this.last_modified));
    }

    get toBaseFormat() : SongInDb {
        let songInDb: SongInDb = new SongInDb();
        this.countWordsInTitle();
        for (let prop in songInDb)
            songInDb[prop] = this[prop];
        return songInDb;
    }

    countWordsInTitle() {
        if (!this.title_1) {
            this.title_1 = 'Untitled';
        }
        if (hasChinese(this.title_1))
            this.numwords = this.title_1.length;
        else
            this.numwords = countWord(this.title_1);
    }
}