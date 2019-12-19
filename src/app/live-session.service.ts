import { LiveSession, LiveSessionInDb } from '../models/live-session';
import { GenericService } from './dbdata.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LiveSessionService extends GenericService<LiveSession, LiveSessionInDb> {};
