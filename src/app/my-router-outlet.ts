
import { Component, ComponentRef, Directive, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Directive ({
    selector: 'my-router-outlet'
})
export class MyRouterOutlet extends RouterOutlet {

    @Output()
    attached : EventEmitter<Component> = new EventEmitter<Component>();

    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
        this.attached.emit(ref.instance);
        super.attach(ref, activatedRoute);
    }
}