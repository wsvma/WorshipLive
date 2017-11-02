import { LiveSessionService } from './live-session.service';
import { LiveSession } from '../models/live-session';

export let liveSessionsServiceFactory = () => {
    return new LiveSessionService(LiveSession, 'live');
}

export let LiveSessionServiceProvider = {
    provide: LiveSession,
    useFactory: liveSessionsServiceFactory
}