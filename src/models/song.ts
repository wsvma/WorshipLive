import { FeatherService } from '../app/feather.service';
import { Page } from './page';
import { DbObj, DbObjBase, EmptyDbObjBase } from './dbobj';
import * as countWord from 'wordcount';
import * as hasChinese from 'has-chinese';
import { toMyDateFormat } from '../utils/utils'

export class SongInDb extends DbObjBase {
    constructor(objInDb = EmptyDbObjBase) {
        super(objInDb);
    }
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
    service: FeatherService<Song>;

    constructor(songInDb: SongInDb = new SongInDb(), service = null) {
        super();
        this.service = service;
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
        let objInDb: SongInDb = new SongInDb();
        this.countWordsInTitle();
        for (let prop in objInDb)
            if (Array.isArray(objInDb[prop]))
                objInDb[prop] = this[prop].slice();
            else
                objInDb[prop] = this[prop];
        return objInDb;
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
        return JSON.stringify(this, this.replacer) == JSON.stringify(song, this.replacer);
    }

    getClone() {
        return new Song(this.toBaseFormat, this.service);
    }

    private getSegments(lyrics: string) : Segment[] {
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
        return this.getPages(false).map(p => p.name);
    }

    getPages(expand = true) : Page[] {
        let pagesArr = [];
        let pagesMap = {};
        for (let s of this.getSegments(this.lyrics_1)) {
            let page = new Page(s.name, s.value, '', 2);
            pagesMap[s.name] = page;
            pagesArr.push(page);
        }
        if (this.lyrics_2) {
            for (let s of this.getSegments(this.lyrics_2)) {
                if (s.name in pagesMap)
                    pagesMap[s.name].content2 = s.value;
                else {
                    let page = new Page(s.name, '', s.value, 2);
                    pagesMap[s.name] = page;
                    pagesArr.push(page);
                }
            }
        }
        if (expand && this.order.length) {
            pagesArr = this.order.map(name => pagesMap[name]);
        }
        return pagesArr;
    }

    update() {
        if (this.service)
            return this.service.update(this);
        return null;
    }
}