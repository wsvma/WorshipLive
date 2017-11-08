import { LiveSessionService } from './live-session.service';
import { LiveSession } from '../models/live-session';

export let liveSessionsServiceFactory = () => {
    return new LiveSessionService(LiveSession, 'api/live');
}

export let LiveSessionServiceProvider = {
    provide: LiveSessionService,
    useFactory: liveSessionsServiceFactory
}