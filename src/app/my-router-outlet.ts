
import { Component, ComponentRef, Directive, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

interface AttachInfo {
    component: Component;
    route: ActivatedRoute;
}

@Directive ({
    selector: 'my-router-outlet'
})
export class MyRouterOutlet extends RouterOutlet {

    @Output()
    attached : EventEmitter<AttachInfo> = new EventEmitter<AttachInfo>();

    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
        this.attached.emit({ component: ref.instance, route: activatedRoute });
        super.attach(ref, activatedRoute);
    }
}