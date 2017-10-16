
export class SongInDb {
    song_id: string = '';
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
    _id: string = '';
    last_modified: string = '';
}

export class Song extends SongInDb {

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
        let d = new Date(this.last_modified);
        return ''+ d.getFullYear() + '-' +
            ('0'+(d.getMonth()+1)).slice(-2) + '-' +
            ('0'+d.getDate()).slice(-2);
      }

    get songInDbFormat() : SongInDb {
        let songInDb: SongInDb = new SongInDb();
        for (let prop in songInDb)
            songInDb[prop] = this[prop];
        return songInDb;
    }
}