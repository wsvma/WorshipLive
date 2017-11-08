import { LiveSessionService } from './live-session.service';
import { LiveSession } from '../models/live-session';

export let liveSessionsServiceFactory = () => {
    let service = new LiveSessionService();
    service.serviceName = 'api/live';
    service.tConstructor = LiveSession;
    return service;
}

export let LiveSessionServiceProvider = {
    provide: LiveSessionService,
    useFactory: liveSessionsServiceFactory
}