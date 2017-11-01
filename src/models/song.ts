import { DbObj, DbObjBase } from './dbobj';
import * as countWord from 'wordcount';
import * as hasChinese from 'has-chinese';
import { toMyDateFormat } from '../utils/utils'

export class SongInDb extends DbObjBase {
    title_1: string = '';
    title_2: string = '';
    writer: string = '';
    copyright: string = '';
    lyrics_1: string = '';
    lyrics_2: string = '';
    sequence: string = '';
    order: string[] = [];
    key: string = '';
    category: string = '';
    numwords: number = 0;
    capo: string = '';
    timing: string = '';
    license_admin1: string = '';
    license_admin2: string = '';
}

class Segment {
    constructor(
        public name: string,
        public value: string
    ) {}
}

export class Song extends SongInDb implements DbObj {

    removed: boolean;

    constructor(songInDb: SongInDb) {
        super();
        for (let prop in songInDb)
            if (Array.isArray(songInDb[prop]))
                this[prop] = songInDb[prop].slice();
            else
                this[prop] = songInDb[prop];
    }

    get title() : string {
        if (this.title_2)
            return this.title_1 + ' | ' + this.title_2;
        if (this.title_1)
            return this.title_1;
        return 'Untitled';
    }

    get last_modified_iso() {
        return toMyDateFormat(new Date(this.last_modified));
    }

    get toBaseFormat() : SongInDb {
        let songInDb: SongInDb = new SongInDb();
        this.countWordsInTitle();
        for (let prop in songInDb)
            if (Array.isArray(songInDb[prop]))
                songInDb[prop] = this[prop].slice();
            else
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

    isEqual(song : Song) {
        return JSON.stringify(this) == JSON.stringify(song);
    }

    getClone() {
        return new Song(this.toBaseFormat);
    }

    private getSegments(lyrics: string)
    {
        let segments = [];
        let re = new RegExp('\\n*\\[.*\\]\\n*', 'g');
        let contents = lyrics.split(re);
        let names = ['[untagged]', ...lyrics.match(re)];
        for (let i = 0; i < contents.length; i++)
            segments.push(new Segment(names[i].trim().slice(1,-1), contents[i].trim()));
        if (!segments[0].value)
            segments.splice(0, 1);
        return segments;
    }

    get tags() {
        let segments = this.getSegments(this.lyrics_1);
        return segments.map(s => s.name);
    }
}