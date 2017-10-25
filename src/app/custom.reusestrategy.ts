import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

      private handles: {[key: string]: DetachedRouteHandle} = {};

      shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return true;
      }

      store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        this.handles[this.url(route)] = handle;
      }

      shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!this.handles[this.url(route)];
      }

      retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        return this.handles[this.url(route)];
      }

      shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
      }

      private url(route: ActivatedRouteSnapshot) : string {
        return route.url.join('/') || route.parent.url.join('/');
      }
}
