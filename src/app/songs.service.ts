import { GenericService } from './dbdata.service';
import { Injectable } from '@angular/core';
import { Song, SongInDb } from '../models/song'

@Injectable()
export class SongsService extends GenericService<Song, SongInDb> {}