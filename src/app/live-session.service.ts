import { LiveSession, LiveSessionInDb } from '../models/live-session';
import { GenericService } from './feather.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LiveSessionService extends GenericService<LiveSession, LiveSessionInDb> {};
