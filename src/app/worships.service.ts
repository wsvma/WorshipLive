import { GenericService } from './feather.service';
import { Worship, WorshipInDb } from '../models/worship';
import { Injectable } from '@angular/core';

@Injectable()
export class WorshipsService extends GenericService<Worship, WorshipInDb> {}