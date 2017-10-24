import { Inject } from '@angular/core';
import { TabDisplayService } from './tab-display.service';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

      private handles: {[key: string]: DetachedRouteHandle} = {};

      constructor(@Inject(TabDisplayService) private tabService: TabDisplayService) {

      }

      shouldDetach(route: ActivatedRouteSnapshot): boolean {
        let url = this.url(route);

        // song edit page
        if (url.startsWith('songs') && !url.endsWith('songs'))
          return false;

        return true;
      }

      store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        this.handles[this.url(route)] = handle;
      }

      shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!this.handles[this.url(route)];
      }

      retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (this.url(route) === 'songs')
          this.tabService.pushNewDisplay('Songs');
        if (this.url(route) === 'worship')
          this.tabService.pushNewDisplay('Worship');
        return this.handles[this.url(route)];
      }

      shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
      }

      private url(route: ActivatedRouteSnapshot) : string {
        return route.url.join('/') || route.parent.url.join('/');
      }
}
